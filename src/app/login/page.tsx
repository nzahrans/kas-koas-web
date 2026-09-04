"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { Stethoscope, KeyRound, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Outer Card Wrapper (Membungkus Seluruh Konten & Form) */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/70 p-6 sm:p-8 space-y-6">
        {/* Header: Logo, Judul & Deskripsi */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Kas Low Kort1sol
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Login untuk mengakses pembukuan Kas Low Kort1sol
          </p>
        </div>

        {/* Inner Card Wrapper (Membungkus Form Login) */}
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
          {/* Pesan Error ketika Login Gagal */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                disabled={isPending}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                disabled={isPending}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 mt-5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Login</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-700">
            <strong>Akun Default Awal:</strong>
            <div className="mt-1">
              Username: <code>bendahara</code> | Password: <code>admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
