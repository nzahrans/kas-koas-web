import Link from "next/link";
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Minus, 
  ArrowRight,
  TrendingUp,
  Calendar,
  User,
  Layers,
  Sparkles
} from "lucide-react";
import { getDashboardSummary } from "@/actions/transaction";
import { formatIDR, formatDateID } from "@/lib/utils";
import ShareSummaryButton from "@/components/ShareSummaryButton";

export const revalidate = 0; // Dynamic data

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-blue-700/15">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-blue-50 text-[11px] font-semibold mb-2 backdrop-blur-xs">
              <TrendingUp className="w-3.5 h-3.5" /> Pembukuan Kas Low Kort1sol Real-Time
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Keuangan Kas Low Kort1sol
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-lg">
              Catatan kas transparan terpisah untuk Kas Kelompok dan Kas Gelombang.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <ShareSummaryButton
              balance={summary.balance}
              totalIncome={summary.totalIncome}
              totalExpense={summary.totalExpense}
              kelompok={summary.kelompok}
              gelombang={summary.gelombang}
              groupName="Kas Low Kort1sol"
            />
            <Link
              href="/income/new"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> Catat Pemasukan
            </Link>
            <Link
              href="/expense/new"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/20 transition transform active:scale-95"
            >
              <Minus className="w-4 h-4" /> Catat Pengeluaran
            </Link>
          </div>
        </div>
      </div>

      {/* 2 Main Cashbook Summary Cards (Kelompok & Gelombang) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kas Kelompok Card */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200/70 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              <h2 className="font-extrabold text-slate-900 text-base">Kas Kelompok</h2>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {summary.kelompok.incomeCount + summary.kelompok.expenseCount} Transaksi
            </span>
          </div>

          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500">Sisa Saldo Kas Kelompok</span>
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${summary.kelompok.balance < 0 ? "text-rose-600" : "text-blue-700"}`}>
              {formatIDR(summary.kelompok.balance)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 bg-slate-50/60 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Masuk</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <ArrowDownLeft className="w-3.5 h-3.5 shrink-0" />
                +{formatIDR(summary.kelompok.totalIncome)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Keluar</span>
              <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                -{formatIDR(summary.kelompok.totalExpense)}
              </span>
            </div>
          </div>
        </div>

        {/* Kas Gelombang Card */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200/70 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
              <h2 className="font-extrabold text-slate-900 text-base">Kas Gelombang</h2>
            </div>
            <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
              {summary.gelombang.incomeCount + summary.gelombang.expenseCount} Transaksi
            </span>
          </div>

          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500">Sisa Saldo Kas Gelombang</span>
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${summary.gelombang.balance < 0 ? "text-rose-600" : "text-teal-700"}`}>
              {formatIDR(summary.gelombang.balance)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 bg-slate-50/60 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Masuk</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <ArrowDownLeft className="w-3.5 h-3.5 shrink-0" />
                +{formatIDR(summary.gelombang.totalIncome)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Keluar</span>
              <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                -{formatIDR(summary.gelombang.totalExpense)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Overview Mini Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Total Saldo Gabungan (Semua Kas)</div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {formatIDR(summary.balance)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Masuk</span>
            <span className="text-emerald-400 font-bold">+{formatIDR(summary.totalIncome)}</span>
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Keluar</span>
            <span className="text-rose-400 font-bold">-{formatIDR(summary.totalExpense)}</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Mutasi Transaksi Terakhir</h2>
            <p className="text-slate-500 text-xs mt-0.5">Transaksi terakhir yang dicatat di sistem</p>
          </div>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {summary.recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada transaksi kas yang dicatat. Klik tombol <strong>Catat Pemasukan</strong> untuk memulai.
            </div>
          ) : (
            summary.recentTransactions.map((trx) => {
              const isIncome = trx.type === "INCOME";
              const isKelompok = trx.kasType === "KELOMPOK";
              const hasCustomCategory =
                trx.category &&
                !["Kas Kelompok", "Kas Gelombang", "Uang Kas Kelompok", "Uang Kas Gelombang"].includes(trx.category);

              return (
                <div key={trx.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {trx.notes || (hasCustomCategory ? trx.category : (isIncome ? "Pemasukan Kas" : "Pengeluaran Kas"))}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isKelompok
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-teal-50 text-teal-700 border border-teal-200"
                          }`}
                        >
                          {isKelompok ? "Kas Kelompok" : "Kas Gelombang"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDateID(trx.date)}
                        </span>
                        {isIncome && (trx.payerPayee || trx.member?.name) && (
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <User className="w-3 h-3 text-slate-400" />
                            {trx.member?.name ? `${trx.member.name}${trx.member.nim ? ` (${trx.member.nim})` : ""}` : trx.payerPayee}
                          </span>
                        )}
                        {!isIncome && trx.payerPayee && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {trx.payerPayee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-extrabold text-sm sm:text-base ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}{formatIDR(trx.amount)}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isIncome ? "Kas Masuk" : "Kas Keluar"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
