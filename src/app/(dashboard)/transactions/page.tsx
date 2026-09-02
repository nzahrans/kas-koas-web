import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatIDR, formatDateID } from "@/lib/utils";
import Link from "next/link";
import TransactionControls from "@/components/TransactionControls";
import ShareSummaryButton from "@/components/ShareSummaryButton";
import DeleteTransactionModal from "@/components/DeleteTransactionModal";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Pencil,
  PlusCircle, 
  MinusCircle
} from "lucide-react";

interface TransactionsPageProps {
  searchParams: Promise<{
    type?: string;
    kasType?: string;
    q?: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const session = await getSession();
  const params = await searchParams;
  const filterType = params.type;
  const filterKasType = params.kasType?.toUpperCase();
  const searchQuery = params.q?.trim();

  const whereClause: any = {};
  if (filterType === "INCOME" || filterType === "EXPENSE") {
    whereClause.type = filterType;
  }
  if (filterKasType === "KELOMPOK" || filterKasType === "GELOMBANG") {
    whereClause.kasType = filterKasType;
  }
  if (searchQuery) {
    whereClause.OR = [
      { category: { contains: searchQuery, mode: "insensitive" } },
      { notes: { contains: searchQuery, mode: "insensitive" } },
      { payerPayee: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" },
      { id: "desc" },
    ],
    include: { member: true },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const titleKas = filterKasType === "KELOMPOK" ? "Kas Kelompok" : filterKasType === "GELOMBANG" ? "Kas Gelombang" : "Semua Kas";

  return (
    <div className="space-y-6">
      {/* Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tight">
            Riwayat Kas ({titleKas})
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Daftar lengkap transaksi kas masuk dan keluar kelompok koas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <ShareSummaryButton
            balance={balance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            groupName={`Kas Koas FKH (${titleKas})`}
          />
          <Link
            href="/income/new"
            className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" /> + Masuk
          </Link>
          <Link
            href="/expense/new"
            className="flex items-center gap-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <MinusCircle className="w-3.5 h-3.5" /> - Keluar
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <TransactionControls totalCount={transactions.length} />

      {/* Table Data Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Buku Kas</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4">Kategori / Keterangan</th>
                <th className="py-3 px-4">Pihak / Anggota</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                {session && <th className="py-3 px-4 text-center no-print">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={session ? 7 : 6} className="py-12 text-center text-slate-400">
                    Tidak ada data transaksi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => {
                  const isIncome = trx.type === "INCOME";
                  const isKelompok = trx.kasType === "KELOMPOK";
                  return (
                    <tr key={trx.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {formatDateID(trx.date)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isKelompok
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-teal-50 text-teal-700 border border-teal-200"
                          }`}
                        >
                          {isKelompok ? "Kas Kelompok" : "Kas Gelombang"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isIncome ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {isIncome ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{trx.category}</div>
                        {trx.notes && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{trx.notes}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {trx.payerPayee || trx.member?.name || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-extrabold text-sm">
                        <span className={isIncome ? "text-emerald-600" : "text-rose-600"}>
                          {isIncome ? "+" : "-"}{formatIDR(trx.amount)}
                        </span>
                      </td>
                      {session && (
                        <td className="py-3.5 px-4 text-center whitespace-nowrap no-print">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              href={`/transactions/${trx.id}/edit`}
                              title="Edit Transaksi"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <DeleteTransactionModal
                              transaction={{
                                id: trx.id,
                                type: trx.type,
                                amount: trx.amount,
                                category: trx.category,
                                date: trx.date,
                                payerPayee: trx.payerPayee || trx.member?.name,
                              }}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
            {transactions.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-200 text-slate-900 text-xs">
                  <td colSpan={4} className="py-3.5 px-4">
                    Total Rekap Terpilih:
                  </td>
                  <td colSpan={session ? 3 : 2} className="py-3.5 px-4 text-right">
                    <span className="text-emerald-600 mr-3">Masuk: +{formatIDR(totalIncome)}</span>
                    <span className="text-rose-600">Keluar: -{formatIDR(totalExpense)}</span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
