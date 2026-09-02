import { loginAction } from "@/actions/auth";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Stethoscope, KeyRound } from "lucide-react";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  async function handleLogin(formData: FormData) {
    "use server";
    await loginAction(formData);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Login Kas Koas FKH
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Masuk untuk mengakses pembukuan Kas Kelompok dan Kas Gelombang
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-8">
          <form action={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username Bendahara / Admin
              </label>
              <input
                type="text"
                name="username"
                required
                placeholder="bendahara"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 mt-6"
            >
              <KeyRound className="w-4 h-4" /> Masuk ke Sistem
            </button>
          </form>

          <div className="mt-6 p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-700">
            <strong>Akun Default Awal:</strong>
            <div className="mt-1">Username: <code>bendahara</code> | Password: <code>admin123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
