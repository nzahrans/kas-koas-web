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
