"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { formatIDR, formatDateID } from "@/lib/utils";

interface KasDetail {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

interface ShareSummaryButtonProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  kelompok?: KasDetail;
  gelombang?: KasDetail;
  groupName?: string;
}

export default function ShareSummaryButton({
  balance,
  totalIncome,
  totalExpense,
  kelompok,
  gelombang,
  groupName = "Kas Low Kort1sol",
}: ShareSummaryButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const today = formatDateID(new Date());

    let message = `📢 *UPDATE LAPORAN ${groupName.toUpperCase()}*
📅 _Per: ${today}_

`;

    if (kelompok && gelombang) {
      message += `👥 *1. KAS KELOMPOK:*
💰 Saldo: *${formatIDR(kelompok.balance)}*
🟢 Masuk: ${formatIDR(kelompok.totalIncome)}
🔴 Keluar: ${formatIDR(kelompok.totalExpense)}

🌊 *2. KAS GELOMBANG:*
💰 Saldo: *${formatIDR(gelombang.balance)}*
🟢 Masuk: ${formatIDR(gelombang.totalIncome)}
🔴 Keluar: ${formatIDR(gelombang.totalExpense)}

━━━━━━━━━━━━━━━━━━━━
💳 *TOTAL SALDO GABUNGAN: ${formatIDR(balance)}*
`;
    } else {
      message += `💰 *Sisa Saldo Kas:* *${formatIDR(balance)}*
🟢 *Total Kas Masuk:* ${formatIDR(totalIncome)}
🔴 *Total Kas Keluar:* ${formatIDR(totalExpense)}
`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━
📌 _Rincian & catatan transaksi dapat diakses melalui website Kas Low Kort1sol._
Semangat rekan-rekan semua! 🙏✨`;

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
      title="Salin ringkasan kas untuk dibagikan ke WhatsApp grup"
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
