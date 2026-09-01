"use server";

import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      return { error: "Username atau password salah." };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: "Username atau password salah." };
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("koas_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    });

    // Catat audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        details: `User ${user.name} (${user.username}) berhasil login`,
      },
    }).catch(() => {});
  } catch (err: unknown) {
    console.error("Login error:", err);
    return { error: "Terjadi kendala saat proses login. Coba lagi." };
  }

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("koas_auth_token");
  redirect("/login");
}
