"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { KasType } from "@prisma/client";

export async function createTransactionAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  const type = formData.get("type") as "INCOME" | "EXPENSE";
  const kasTypeRaw = (formData.get("kasType") as string)?.toUpperCase();
  const kasType: KasType = kasTypeRaw === "GELOMBANG" ? KasType.GELOMBANG : KasType.KELOMPOK;
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
  const memberIdsRaw = formData.getAll("memberIds") as string[];
  let memberIds: number[] = [];
  if (memberIdsRaw && memberIdsRaw.length > 0) {
    memberIds = memberIdsRaw.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
  } else if (memberIdStr) {
    const singleId = parseInt(memberIdStr, 10);
    if (!isNaN(singleId)) memberIds = [singleId];
  }

  const kasLabel = kasType === "GELOMBANG" ? "Kas Gelombang" : "Kas Kelompok";

  try {
    if (memberIds.length > 1) {
      // Buat transaksi per masing-masing anggota secara batch
      await prisma.$transaction(
        memberIds.map((mId) =>
          prisma.transaction.create({
            data: {
              type,
              kasType,
              amount,
              category,
              payerPayee: null,
              date,
              notes,
              memberId: mId,
              recorderName: session.name || session.username,
            },
          })
        )
      );

      const totalAmount = amount * memberIds.length;
      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: `CREATE_${type}_BATCH`,
          details: `Mencatat ${type === "INCOME" ? "Pemasukan" : "Pengeluaran"} [${kasLabel}] untuk ${memberIds.length} anggota masing-masing Rp ${amount.toLocaleString("id-ID")} (Total Rp ${totalAmount.toLocaleString("id-ID")}) (${category})`,
        },
      }).catch(() => {});
    } else if (memberIds.length === 1) {
      await prisma.transaction.create({
        data: {
          type,
          kasType,
          amount,
          category,
          payerPayee: null,
          date,
          notes,
          memberId: memberIds[0],
          recorderName: session.name || session.username,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: `CREATE_${type}`,
          details: `Mencatat ${type === "INCOME" ? "Pemasukan" : "Pengeluaran"} [${kasLabel}] sebesar Rp ${amount.toLocaleString("id-ID")} (${category})`,
        },
      }).catch(() => {});
    } else {
      await prisma.transaction.create({
        data: {
          type,
          kasType,
          amount,
          category,
          payerPayee,
          date,
          notes,
          memberId: null,
          recorderName: session.name || session.username,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: `CREATE_${type}`,
          details: `Mencatat ${type === "INCOME" ? "Pemasukan" : "Pengeluaran"} [${kasLabel}] sebesar Rp ${amount.toLocaleString("id-ID")} (${category})`,
        },
      }).catch(() => {});
    }

    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/members");
    return { success: true };
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
        details: `Menghapus transaksi ID #${id} (${trx.type} [${trx.kasType}] Rp ${trx.amount.toLocaleString("id-ID")})`,
      },
    }).catch(() => {});

    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/members");
    return { success: true };
  } catch (err: unknown) {
    console.error("Delete transaction error:", err);
    return { error: "Gagal menghapus transaksi." };
  }
}

export async function updateTransactionAction(id: number, formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
    return { error: "Akses ditolak. Silakan login sebagai Bendahara/Admin terlebih dahulu." };
  }

  const kasTypeRaw = (formData.get("kasType") as string)?.toUpperCase();
  const kasType: KasType = kasTypeRaw === "GELOMBANG" ? KasType.GELOMBANG : KasType.KELOMPOK;
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
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Transaksi tidak ditemukan." };
    }

    const updatedTrx = await prisma.transaction.update({
      where: { id },
      data: {
        kasType,
        amount,
        category,
        payerPayee: memberId ? null : payerPayee,
        date,
        notes,
        memberId: isNaN(memberId as number) ? null : memberId,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: `UPDATE_${updatedTrx.type}`,
        details: `Mengubah transaksi ID #${id} (${updatedTrx.type} [${kasType}]) menjadi Rp ${amount.toLocaleString("id-ID")} (${category})`,
      },
    }).catch(() => {});

    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/members");
    return { success: true, transactionId: updatedTrx.id };
  } catch (err: unknown) {
    console.error("Update transaction error:", err);
    return { error: "Gagal memperbarui data transaksi." };
  }
}

export async function getTransactionById(id: number) {
  try {
    return await prisma.transaction.findUnique({
      where: { id },
      include: { member: true },
    });
  } catch (err) {
    console.error("Get transaction error:", err);
    return null;
  }
}

export async function getDashboardSummary() {
  try {
    const [
      incomeKelompokAgg,
      expenseKelompokAgg,
      incomeGelombangAgg,
      expenseGelombangAgg,
      recentTransactions,
      membersCount,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: "INCOME", kasType: "KELOMPOK" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "EXPENSE", kasType: "KELOMPOK" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "INCOME", kasType: "GELOMBANG" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "EXPENSE", kasType: "GELOMBANG" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.transaction.findMany({
        take: 8,
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" },
          { id: "desc" },
        ],
        include: { member: true },
      }),
      prisma.member.count({ where: { active: true } }),
    ]);

    const kelompokIncome = incomeKelompokAgg._sum.amount || 0;
    const kelompokExpense = expenseKelompokAgg._sum.amount || 0;
    const kelompokBalance = kelompokIncome - kelompokExpense;

    const gelombangIncome = incomeGelombangAgg._sum.amount || 0;
    const gelombangExpense = expenseGelombangAgg._sum.amount || 0;
    const gelombangBalance = gelombangIncome - gelombangExpense;

    const totalIncome = kelompokIncome + gelombangIncome;
    const totalExpense = kelompokExpense + gelombangExpense;
    const totalBalance = totalIncome - totalExpense;

    return {
      balance: totalBalance,
      totalIncome,
      totalExpense,
      incomeCount: (incomeKelompokAgg._count.id || 0) + (incomeGelombangAgg._count.id || 0),
      expenseCount: (expenseKelompokAgg._count.id || 0) + (expenseGelombangAgg._count.id || 0),
      kelompok: {
        balance: kelompokBalance,
        totalIncome: kelompokIncome,
        totalExpense: kelompokExpense,
        incomeCount: incomeKelompokAgg._count.id || 0,
        expenseCount: expenseKelompokAgg._count.id || 0,
      },
      gelombang: {
        balance: gelombangBalance,
        totalIncome: gelombangIncome,
        totalExpense: gelombangExpense,
        incomeCount: incomeGelombangAgg._count.id || 0,
        expenseCount: expenseGelombangAgg._count.id || 0,
      },
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
      kelompok: {
        balance: 0,
        totalIncome: 0,
        totalExpense: 0,
        incomeCount: 0,
        expenseCount: 0,
      },
      gelombang: {
        balance: 0,
        totalIncome: 0,
        totalExpense: 0,
        incomeCount: 0,
        expenseCount: 0,
      },
      recentTransactions: [],
      membersCount: 0,
    };
  }
}
