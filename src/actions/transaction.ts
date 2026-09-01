"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTransactionAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Akses ditolak. Silakan login sebagai Bendahara/Admin terlebih dahulu." };
  }

  const type = formData.get("type") as "INCOME" | "EXPENSE";
  const amountStr = formData.get("amount") as string;
  const category = (formData.get("category") as string)?.trim();
  const payerPayee = (formData.get("payerPayee") as string)?.trim() || null;
  const dateStr = formData.get("date") as string;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const memberIdStr = formData.get("memberId") as string;

  const amount = parseFloat(amountStr?.replace(/[^0-9.-]+/g, "") || "0");
  if (!amount || amount <= 0) {
    return { error: "Nominal transaksi harus lebih besar dari Rp 0." };
  }

  if (!category) {
    return { error: "Kategori transaksi wajib diisi atau dipilih." };
  }

  const date = dateStr ? new Date(dateStr) : new Date();
  const memberId = memberIdStr ? parseInt(memberIdStr, 10) : null;

  try {
    const trx = await prisma.transaction.create({
      data: {
        type,
        amount,
        category,
        payerPayee,
        date,
        notes,
        memberId: isNaN(memberId as number) ? null : memberId,
        recorderName: session.name || session.username,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: `CREATE_${type}`,
        details: `Mencatat ${type === "INCOME" ? "Pemasukan" : "Pengeluaran"} sebesar Rp ${amount.toLocaleString("id-ID")} (${category})`,
      },
    }).catch(() => {});

    revalidatePath("/");
    revalidatePath("/transactions");
    return { success: true, transactionId: trx.id };
  } catch (err: unknown) {
    console.error("Create transaction error:", err);
    return { error: "Gagal menyimpan transaksi ke database." };
  }
}

export async function deleteTransactionAction(id: number) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
    return { error: "Hanya Bendahara atau Admin yang berhak menghapus data transaksi." };
  }

  try {
    const trx = await prisma.transaction.findUnique({ where: { id } });
    if (!trx) return { error: "Transaksi tidak ditemukan." };

    await prisma.transaction.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "DELETE_TRANSACTION",
        details: `Menghapus transaksi ID #${id} (${trx.type} Rp ${trx.amount})`,
      },
    }).catch(() => {});

    revalidatePath("/");
    revalidatePath("/transactions");
    return { success: true };
  } catch (err: unknown) {
    console.error("Delete transaction error:", err);
    return { error: "Gagal menghapus transaksi." };
  }
}

export async function getDashboardSummary() {
  try {
    const [incomeAgg, expenseAgg, recentTransactions, membersCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: "INCOME" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "EXPENSE" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: { member: true },
      }),
      prisma.member.count({ where: { active: true } }),
    ]);

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpense = expenseAgg._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    return {
      balance,
      totalIncome,
      totalExpense,
      incomeCount: incomeAgg._count.id,
      expenseCount: expenseAgg._count.id,
      recentTransactions,
      membersCount,
    };
  } catch (err) {
    console.error("Get summary error:", err);
    return {
      balance: 0,
      totalIncome: 0,
      totalExpense: 0,
      incomeCount: 0,
      expenseCount: 0,
      recentTransactions: [],
      membersCount: 0,
    };
  }
}
