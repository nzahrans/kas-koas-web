import { getSession } from "@/lib/auth";
import { Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatIDR } from "@/lib/utils";
import AddMemberForm from "@/components/AddMemberForm";
import EditMemberModal from "@/components/EditMemberModal";
import DeleteMemberModal from "@/components/DeleteMemberModal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tight">
            Daftar Anggota Koas FKH
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Daftar dokter hewan muda (PPDH) dan rekapitulasi iuran kas per anggota
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Tambah Anggota (Khusus Bendahara) */}
        {session && <AddMemberForm />}

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
                    <div
                      key={m.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate">{m.name}</div>
                          <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                            {m.nim && <span>NIM: {m.nim}</span>}
                            {m.phone && (
                              <span className="flex items-center gap-0.5">
                                <Phone className="w-3 h-3" /> {m.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-600">
                            +{formatIDR(totalPaid)}
                          </div>
                          <span className="text-[10px] text-slate-400">Total Iuran</span>
                        </div>

                        {session && (
                          <div className="flex items-center gap-1 border-l border-slate-100 pl-3">
                            <EditMemberModal
                              member={{
                                id: m.id,
                                name: m.name,
                                nim: m.nim,
                                phone: m.phone,
                              }}
                            />
                            <DeleteMemberModal
                              member={{
                                id: m.id,
                                name: m.name,
                                nim: m.nim,
                                totalPaid,
                              }}
                            />
                          </div>
                        )}
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
