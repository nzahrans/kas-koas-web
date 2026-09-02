"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTransactionAction } from "@/actions/transaction";
import { formatIDR } from "@/lib/utils";
import Link from "next/link";
import { 
  ArrowDownLeft, 
  ArrowLeft, 
  PlusCircle, 
  Loader2, 
  Users, 
  ChevronDown, 
  X, 
  Check, 
  Search,
  CheckSquare,
  Square
} from "lucide-react";

interface Member {
  id: number;
  name: string;
  nim: string | null;
}

interface NewIncomeFormProps {
  members: Member[];
}

export default function NewIncomeForm({ members }: NewIncomeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [kasType, setKasType] = useState<"KELOMPOK" | "GELOMBANG">("KELOMPOK");
  const [category, setCategory] = useState<string>("Uang Kas Kelompok");
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [amountInput, setAmountInput] = useState<string>("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Uang Kas Kelompok",
    "Uang Kas Gelombang",
    "Other",
  ];

  const handleKasTypeChange = (type: "KELOMPOK" | "GELOMBANG") => {
    setKasType(type);
    if (type === "KELOMPOK") {
      setCategory("Uang Kas Kelompok");
    } else {
      setCategory("Uang Kas Gelombang");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const [useCustomPayer, setUseCustomPayer] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMember = (id: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const removeMember = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMemberIds((prev) => prev.filter((mId) => mId !== id));
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMemberIds.length === members.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(members.map((m) => m.id));
    }
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.nim && m.nim.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const parsedAmount = parseFloat(amountInput.replace(/[^0-9.-]+/g, "") || "0");
  const totalBatchAmount = selectedMemberIds.length > 0 ? parsedAmount * selectedMemberIds.length : parsedAmount;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("type", "INCOME");
    formData.append("kasType", kasType);

    if (!useCustomPayer) {
      formData.delete("memberIds");
      selectedMemberIds.forEach((id) => {
        formData.append("memberIds", id.toString());
      });
    }

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
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-lg">Catat Pemasukan Kas</h1>
            <p className="text-slate-500 text-xs">Pencatatan iuran atau uang masuk Kas Kelompok / Gelombang</p>
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
              Nominal {selectedMemberIds.length > 1 ? "per Anggota" : "Uang Masuk"} (Rp) <span className="text-rose-500">*</span>
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
                placeholder="50.000"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Kategori Pemasukan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kategori Transaksi <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Nama Penyetor / Anggota Koas (Multi-Select Tag Dropdown) */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Nama Penyetor ({useCustomPayer ? "Pihak Luar / Manual" : "Pilih Anggota Koas"})
              </label>
              {members.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomPayer(!useCustomPayer);
                    setIsDropdownOpen(false);
                  }}
                  className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  {useCustomPayer ? "Pilih dari Daftar Anggota" : "Ketik Nama Manual"}
                </button>
              )}
            </div>

            {!useCustomPayer && members.length > 0 ? (
              <div className="space-y-2">
                {/* Clickable Select Input Box showing Selected Tags */}
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`min-h-[44px] w-full p-2 rounded-xl border bg-white cursor-pointer transition flex flex-wrap items-center gap-1.5 ${
                    isDropdownOpen
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {selectedMemberIds.length === 0 ? (
                    <div className="flex items-center justify-between w-full px-2 text-slate-400 text-xs font-medium">
                      <span>-- Klik untuk memilih nama anggota koas --</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  ) : (
                    <>
                      {selectedMemberIds.map((id) => {
                        const m = members.find((item) => item.id === id);
                        if (!m) return null;
                        return (
                          <span
                            key={m.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-semibold shadow-2xs"
                          >
                            <span>{m.name}</span>
                            {m.nim && <span className="text-[10px] text-blue-500 font-normal">({m.nim})</span>}
                            <button
                              type="button"
                              onClick={(e) => removeMember(m.id, e)}
                              className="p-0.5 hover:bg-blue-200 text-blue-600 hover:text-blue-900 rounded-full transition cursor-pointer"
                              title="Hapus nama ini"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                      <div className="ml-auto pr-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                          +{selectedMemberIds.length}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </>
                  )}
                </div>

                {/* Floating Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 z-50 mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-2 space-y-2 animate-in fade-in-50 zoom-in-95">
                    {/* Dropdown Header: Search & Select All */}
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari nama atau NIM..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-2.5 py-1.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1"
                      >
                        {selectedMemberIds.length === members.length ? (
                          <>
                            <Square className="w-3.5 h-3.5" /> Batal Semua
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-3.5 h-3.5" /> Pilih Semua
                          </>
                        )}
                      </button>
                    </div>

                    {/* Member Items List */}
                    <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 rounded-lg">
                      {filteredMembers.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          Tidak ditemukan anggota dengan nama tersebut.
                        </div>
                      ) : (
                        filteredMembers.map((m) => {
                          const isSelected = selectedMemberIds.includes(m.id);
                          return (
                            <div
                              key={m.id}
                              onClick={() => toggleMember(m.id)}
                              className={`p-2.5 flex items-center justify-between cursor-pointer rounded-lg transition select-none ${
                                isSelected
                                  ? "bg-blue-50 text-blue-900 font-semibold"
                                  : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div>
                                <div className="text-xs font-bold">{m.name}</div>
                                {m.nim && <div className="text-[10px] text-slate-400">NIM: {m.nim}</div>}
                              </div>
                              {isSelected ? (
                                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="w-5 h-5 rounded-full border border-slate-300 shrink-0"></span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Live Calculation Banner when multiple selected */}
                {selectedMemberIds.length > 1 && parsedAmount > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold block">Total Transaksi ({selectedMemberIds.length} anggota):</span>
                      <span className="text-[11px] text-emerald-600">
                        {formatIDR(parsedAmount)} &times; {selectedMemberIds.length} orang
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-emerald-700">
                      {formatIDR(totalBatchAmount)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="text"
                name="payerPayee"
                placeholder="Contoh: drh. Naufal / Pihak Sponsor / Alumni"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            )}
          </div>

          {/* Keterangan / Catatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Keterangan / Catatan (Opsional)
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Catatan tambahan..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan Pemasukan...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                {selectedMemberIds.length > 1
                  ? `Simpan Pemasukan (${selectedMemberIds.length} Anggota - ${formatIDR(totalBatchAmount)})`
                  : "Simpan Pemasukan"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
