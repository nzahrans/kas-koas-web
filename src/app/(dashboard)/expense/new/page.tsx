import { createTransactionAction } from "@/actions/transaction";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, ArrowLeft, MinusCircle } from "lucide-react";

export default async function NewExpensePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/expense/new");
  }

  const defaultCategories = [
    "Konsumsi / Makan Jaga",
    "Alat Medis (Spuit, Handscoon, dsb)",
    "Fotokopi / Cetak Modul / Status Pasien",
    "Bingkisan / Cinderamata Residen & Konsulen",
    "Transport / Operasional Stase",
    "Lain-lain",
  ];

  async function handleSubmit(formData: FormData) {
    "use server";
    formData.append("type", "EXPENSE");
    const res = await createTransactionAction(formData);
    if (res?.success) {
      redirect("/");
    }
  }

  const today = new Date().toISOString().split("T")[0];

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
            <p className="text-slate-500 text-xs">Pencatatan biaya pengeluaran stase & keperluan kelompok</p>
          </div>
        </div>

        <form action={handleSubmit} className="space-y-4">
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
                type="number"
                name="amount"
                required
                min="500"
                step="500"
                placeholder="25.000"
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

          {/* Kategori Pengeluaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kategori Pengeluaran <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              required
              defaultValue={defaultCategories[0]}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              {defaultCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Peruntukan / Pembeli */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Peruntukan / PIC Pembeli
            </label>
            <input
              type="text"
              name="payerPayee"
              placeholder="Contoh: Beli di Apotek K-24 / Konsumsi Jaga Malam"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Keterangan / Catatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Keterangan Rinci (Opsional)
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Rincian item atau alasan pengeluaran..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2 mt-4"
          >
            <MinusCircle className="w-4 h-4" /> Simpan Pengeluaran
          </button>
        </form>
      </div>
    </div>
  );
}
