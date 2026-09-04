"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTransactionAction } from "@/actions/transaction";
import { formatNumberInput, parseNumberInput } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, MinusCircle, Loader2 } from "lucide-react";

export default function NewExpenseForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [kasType, setKasType] = useState<"KELOMPOK" | "GELOMBANG">("KELOMPOK");
  const [amountInput, setAmountInput] = useState<string>("");

  const handleKasTypeChange = (type: "KELOMPOK" | "GELOMBANG") => {
    setKasType(type);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const parsedAmount = parseNumberInput(amountInput);
    const formData = new FormData(e.currentTarget);
    formData.set("amount", parsedAmount.toString());
    formData.append("type", "EXPENSE");
    formData.append("kasType", kasType);
    formData.append("category", kasType === "GELOMBANG" ? "Kas Gelombang" : "Kas Kelompok");

    startTransition(async () => {
      const res = await createTransactionAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-lg">Catat Pengeluaran Kas</h1>
            <p className="text-slate-500 text-xs">Pencatatan pengeluaran operasional Kas Kelompok / Gelombang</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilihan Buku Kas (Kas Kelompok vs Kas Gelombang) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Buku Catatan Kas <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleKasTypeChange("KELOMPOK")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  kasType === "KELOMPOK"
                    ? "bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Kas Kelompok
              </button>
              <button
                type="button"
                onClick={() => handleKasTypeChange("GELOMBANG")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  kasType === "GELOMBANG"
                    ? "bg-teal-50 border-teal-600 text-teal-700 ring-2 ring-teal-500/20 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                Kas Gelombang
              </button>
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nominal Pengeluaran (Rp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                name="amount"
                required
                value={amountInput}
                onChange={(e) => setAmountInput(formatNumberInput(e.target.value))}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-base"
              />
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tanggal Transaksi <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              defaultValue={today}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Keterangan / Catatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Keterangan / Catatan (Opsional)
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan Pengeluaran...
              </>
            ) : (
              <>
                <MinusCircle className="w-4 h-4" />
                Simpan Pengeluaran
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
