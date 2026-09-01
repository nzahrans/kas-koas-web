import Link from "next/link";
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Minus, 
  ArrowRight,
  TrendingUp,
  Receipt,
  Calendar,
  User
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/15">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-blue-50 text-[11px] font-semibold mb-2 backdrop-blur-xs">
              <TrendingUp className="w-3.5 h-3.5" /> Laporan Kas PPDH FKH Real-Time
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Keuangan Kas Koas FKH
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-md">
              Pantau arus kas masuk dan pengeluaran operasional stase kelompok dokter hewan muda secara transparan.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <ShareSummaryButton
              balance={summary.balance}
              totalIncome={summary.totalIncome}
              totalExpense={summary.totalExpense}
              groupName="Kelompok Koas FKH"
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

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Sisa Saldo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sisa Saldo Kas</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-extrabold tracking-tight ${summary.balance < 0 ? "text-rose-600" : "text-slate-900"}`}>
              {formatIDR(summary.balance)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Saldo akhir yang tersedia</p>
          </div>
        </div>

        {/* Total Pemasukan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pemasukan</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-emerald-600">
              {formatIDR(summary.totalIncome)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {summary.incomeCount} transaksi iuran tercatat
            </p>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pengeluaran</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-rose-600">
              {formatIDR(summary.totalExpense)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {summary.expenseCount} mutasi pengeluaran stase
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Mutasi Transaksi Terakhir</h2>
            <p className="text-slate-500 text-xs mt-0.5">5 transaksi terakhir yang tercatat di sistem</p>
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
                      <div className="font-bold text-slate-900 text-sm">
                        {trx.category}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDateID(trx.date)}
                        </span>
                        {(trx.payerPayee || trx.member?.name) && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {trx.payerPayee || trx.member?.name}
                          </span>
                        )}
                        {trx.notes && (
                          <span className="text-slate-400 truncate max-w-[160px] sm:max-w-[300px]">
                            &bull; {trx.notes}
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
