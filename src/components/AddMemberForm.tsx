"use client";

import { useState, useTransition } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { createMemberAction } from "@/actions/member";

export default function AddMemberForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createMemberAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        form.reset();
      }
    });
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit">
      <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-sm">
        <UserPlus className="w-4 h-4 text-blue-600" />
        <span>Tambah Anggota Baru</span>
      </div>

      {error && (
        <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Nama Lengkap / Panggilan <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="drh. Naufal / Naufal"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            NIM / ID Koas (Opsional)
          </label>
          <input
            type="text"
            name="nim"
            placeholder="20261010..."
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            No. WhatsApp (Opsional)
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="08123456789"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition mt-2 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "+ Simpan Anggota"
          )}
        </button>
      </form>
    </div>
  );
}
