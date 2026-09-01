import { getMembersList, createMemberAction } from "@/actions/member";
import { getSession } from "@/lib/auth";
import { Users, UserPlus, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatIDR } from "@/lib/utils";

export default async function MembersPage() {
  const session = await getSession();
  const members = await prisma.member.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: {
      transactions: {
        where: { type: "INCOME" },
      },
    },
  });

  async function handleAddMember(formData: FormData) {
    "use server";
    await createMemberAction(formData);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tight">
            Daftar Anggota Koas
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Daftar dokter muda dan rekapitulasi iuran kas per anggota
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Tambah Anggota (Khusus Bendahara) */}
        {session && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit">
            <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-sm">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Tambah Anggota Baru</span>
            </div>

            <form action={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nama Lengkap / Panggilan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="dr. Naufal"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  NIM / ID Koas (Opsional)
                </label>
                <input
                  type="text"
                  name="nim"
                  placeholder="20261010..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  No. WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="08123456789"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition mt-2"
              >
                + Simpan Anggota
              </button>
            </form>
          </div>
        )}

        {/* List Anggota */}
        <div className={session ? "md:col-span-2" : "md:col-span-3"}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Total Anggota: {members.length} Orang</span>
            </div>

            <div className="divide-y divide-slate-100">
              {members.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada data anggota kelompok koas.
                </div>
              ) : (
                members.map((m, idx) => {
                  const totalPaid = m.transactions.reduce((acc, t) => acc + t.amount, 0);
                  return (
                    <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            {m.nim && <span>NIM: {m.nim}</span>}
                            {m.phone && (
                              <span className="flex items-center gap-0.5">
                                <Phone className="w-3 h-3" /> {m.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-600">
                          +{formatIDR(totalPaid)}
                        </div>
                        <span className="text-[10px] text-slate-400">Total Iuran Masuk</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
