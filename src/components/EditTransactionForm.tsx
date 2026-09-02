"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTransactionAction } from "@/actions/transaction";
import { ArrowDownLeft, ArrowUpRight, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Member {
  id: number;
  name: string;
  nim: string | null;
}

interface TransactionData {
  id: number;
  type: "INCOME" | "EXPENSE";
  kasType: "KELOMPOK" | "GELOMBANG";
  amount: number;
  date: Date | string;
  category: string;
  payerPayee: string | null;
  notes: string | null;
  memberId: number | null;
}

interface EditTransactionFormProps {
  transaction: TransactionData;
  members: Member[];
}

export default function EditTransactionForm({ transaction, members }: EditTransactionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isIncome = transaction.type === "INCOME";
  const [kasType, setKasType] = useState<"KELOMPOK" | "GELOMBANG">(transaction.kasType || "KELOMPOK");
  const [category, setCategory] = useState<string>(transaction.category || (transaction.kasType === "GELOMBANG" ? "Uang Kas Gelombang" : "Uang Kas Kelompok"));

  const defaultCategories = [
    "Uang Kas Kelompok",
    "Uang Kas Gelombang",
    "Other",
  ];

  const categories = [...defaultCategories];

  // Include existing category if not in default list
  if (transaction.category && !categories.includes(transaction.category)) {
    categories.push(transaction.category);
  }

  const handleKasTypeChange = (type: "KELOMPOK" | "GELOMBANG") => {
    setKasType(type);
  };

  // Format date to YYYY-MM-DD
  const formattedDate = transaction.date
    ? new Date(transaction.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const [useCustomPayer, setUseCustomPayer] = useState(
    isIncome ? !transaction.memberId && !!transaction.payerPayee : true
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("kasType", kasType);

    startTransition(async () => {
      const res = await updateTransactionAction(transaction.id, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/transactions");
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <Link
        href="/transactions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat Kas
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-lg">
              Edit {isIncome ? "Pemasukan" : "Pengeluaran"} Kas
            </h1>
            <p className="text-slate-500 text-xs">
              ID Transaksi #{transaction.id} &bull; {isIncome ? "Kas Masuk" : "Kas Keluar"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilihan Buku Kas */}
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
              Nominal {isIncome ? "Uang Masuk" : "Pengeluaran"} (Rp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                Rp
              </span>
              <input
                type="number"
                name="amount"
                required
                min="500"
                step="500"
                defaultValue={transaction.amount}
                placeholder="50.000"
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 ${
                  isIncome ? "focus:ring-emerald-500" : "focus:ring-rose-500"
                } focus:border-transparent text-base`}
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
              defaultValue={formattedDate}
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 ${
                isIncome ? "focus:ring-emerald-500" : "focus:ring-rose-500"
              }`}
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kategori Transaksi <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 ${
                isIncome ? "focus:ring-emerald-500" : "focus:ring-rose-500"
              } bg-white`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Pihak / Penyetor / Penerima */}
          {isIncome ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nama Penyetor (Anggota Koas / Pihak Luar)
                </label>
                {members.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseCustomPayer(!useCustomPayer)}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    {useCustomPayer ? "Pilih dari Daftar Anggota" : "Ketik Nama Manual"}
                  </button>
                )}
              </div>

              {!useCustomPayer && members.length > 0 ? (
                <select
                  name="memberId"
                  defaultValue={transaction.memberId || ""}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">-- Pilih Anggota Koas --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.nim ? `(${m.nim})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="payerPayee"
                  defaultValue={transaction.payerPayee || ""}
                  placeholder="Contoh: dr. Naufal / Sumbangan Alumni"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Peruntukan / PIC Pembeli
              </label>
              <input
                type="text"
                name="payerPayee"
                defaultValue={transaction.payerPayee || ""}
                placeholder="Contoh: Apotek K-24 / Konsumsi Jaga Malam"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          {/* Keterangan / Catatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Keterangan / Catatan (Opsional)
            </label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={transaction.notes || ""}
              placeholder="Catatan tambahan keperluan stase..."
              className={`w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 ${
                isIncome ? "focus:ring-emerald-500" : "focus:ring-rose-500"
              }`}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/transactions"
              className="flex-1 py-3 text-center border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className={`flex-1 py-3 ${
                isIncome
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
              } text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
