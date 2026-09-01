"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getMembersList() {
  try {
    return await prisma.member.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("Get members error:", err);
    return [];
  }
}

export async function createMemberAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
    return { error: "Akses ditolak." };
  }

  const name = (formData.get("name") as string)?.trim();
  const nim = (formData.get("nim") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!name) return { error: "Nama anggota koas wajib diisi." };

  try {
    const member = await prisma.member.create({
      data: { name, nim, phone },
    });

    revalidatePath("/members");
    revalidatePath("/income/new");
    return { success: true, memberId: member.id };
  } catch (err) {
    console.error("Create member error:", err);
    return { error: "Gagal menambahkan anggota baru." };
  }
}

export async function updateMemberAction(id: number, formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
    return { error: "Akses ditolak." };
  }

  const name = (formData.get("name") as string)?.trim();
  const nim = (formData.get("nim") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!name) return { error: "Nama anggota koas wajib diisi." };

  try {
    const member = await prisma.member.update({
      where: { id },
      data: { name, nim, phone },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE_MEMBER",
        details: `Mengubah data anggota ${member.name} (ID #${id})`,
      },
    }).catch(() => {});

    revalidatePath("/members");
    revalidatePath("/income/new");
    revalidatePath("/transactions");
    return { success: true, memberId: member.id };
  } catch (err) {
    console.error("Update member error:", err);
    return { error: "Gagal memperbarui data anggota." };
  }
}

export async function deleteMemberAction(id: number) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
    return { error: "Akses ditolak." };
  }

  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return { error: "Data anggota tidak ditemukan." };

    await prisma.member.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "DELETE_MEMBER",
        details: `Menghapus anggota ${member.name} (ID #${id})`,
      },
    }).catch(() => {});

    revalidatePath("/members");
    revalidatePath("/income/new");
    revalidatePath("/transactions");
    return { success: true };
  } catch (err) {
    console.error("Delete member error:", err);
    return { error: "Gagal menghapus data anggota." };
  }
}

