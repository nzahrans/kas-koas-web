"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { formatIDR, formatDateID } from "@/lib/utils";

interface ShareSummaryButtonProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  groupName?: string;
}

export default function ShareSummaryButton({
  balance,
  totalIncome,
  totalExpense,
  groupName = "Kelompok Koas FKH",
}: ShareSummaryButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const today = formatDateID(new Date());

    const message = `📢 *UPDATE LAPORAN KAS ${groupName.toUpperCase()}*
📅 _Per: ${today}_

💰 *Sisa Saldo Kas:* *${formatIDR(balance)}*
🟢 *Total Kas Masuk:* ${formatIDR(totalIncome)}
🔴 *Total Kas Keluar:* ${formatIDR(totalExpense)}

━━━━━━━━━━━━━━━━━━━━
📌 _Rincian & mutasi lengkap dapat dicek langsung melalui website Kas Koas._
Semangat stase rekan-rekan dokter hewan muda! 🙏✨`;

    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer select-none ${
        copied
          ? "bg-emerald-700 text-white"
          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-900/20"
      }`}
      title="Salin ringkasan kas untuk dibagikan ke grup"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Rekap Tersalin!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>Salin Rekap Kas</span>
        </>
      )}
    </button>
  );
}
