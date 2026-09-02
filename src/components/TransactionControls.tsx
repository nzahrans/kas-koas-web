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
  const filterKasType = searchParams.get("kasType");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const createFilterUrl = (newParams: { type?: string | null; kasType?: string | null }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newParams.type !== undefined) {
      if (newParams.type) params.set("type", newParams.type);
      else params.delete("type");
    }

    if (newParams.kasType !== undefined) {
      if (newParams.kasType) params.set("kasType", newParams.kasType);
      else params.delete("kasType");
    }

    return `/transactions?${params.toString()}`;
  };

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
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Kas Type & Transaction Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Kas Book Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <Link
              href={createFilterUrl({ kasType: null })}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                !filterKasType ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua Kas
            </Link>
            <Link
              href={createFilterUrl({ kasType: "KELOMPOK" })}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                filterKasType === "KELOMPOK" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kas Kelompok
            </Link>
            <Link
              href={createFilterUrl({ kasType: "GELOMBANG" })}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                filterKasType === "GELOMBANG" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kas Gelombang
            </Link>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <Link
              href={createFilterUrl({ type: null })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                !filterType ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Semua ({totalCount})
            </Link>
            <Link
              href={createFilterUrl({ type: "INCOME" })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                filterType === "INCOME" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" /> Masuk
            </Link>
            <Link
              href={createFilterUrl({ type: "EXPENSE" })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                filterType === "EXPENSE" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Keluar
            </Link>
          </div>
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak PDF
          </button>
        </div>
      </div>
    </div>
  );
}
