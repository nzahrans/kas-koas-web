"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Printer, Search, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface TransactionControlsProps {
  totalCount: number;
}

export default function TransactionControls({ totalCount }: TransactionControlsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterType = searchParams.get("type");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    router.push(`/transactions?${params.toString()}`);
  };

  return (
    <div className="space-y-3 no-print">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Link
            href="/transactions"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              !filterType ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Semua ({totalCount})
          </Link>
          <Link
            href="/transactions?type=INCOME"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
              filterType === "INCOME" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" /> Pemasukan
          </Link>
          <Link
            href="/transactions?type=EXPENSE"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
              filterType === "EXPENSE" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Pengeluaran
          </Link>
        </div>

        {/* Search & Print */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-56">
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak PDF
          </button>
        </div>
      </div>
    </div>
  );
}
