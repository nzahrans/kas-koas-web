"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  PlusCircle, 
  MinusCircle, 
  Users, 
  LogIn, 
  LogOut,
  Stethoscope
} from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface NavbarProps {
  user: {
    name: string;
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Riwayat Kas", icon: Receipt },
    { href: "/income/new", label: "Pemasukan", icon: PlusCircle, highlight: "green" },
    { href: "/expense/new", label: "Pengeluaran", icon: MinusCircle, highlight: "red" },
    { href: "/members", label: "Anggota", icon: Users },
  ];

  return (
    <>
      {/* Top App Header (Logo & Login / User Profile) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Kelompok Info */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0 mr-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition shrink-0">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-xs sm:text-base leading-tight block truncate">Kas Low Kort1sol</span>
                <span className="text-[9px] sm:text-[11px] text-blue-600 font-medium leading-none block truncate">Buku Kas Kelompok & Gelombang</span>
              </div>
            </Link>

            {/* Desktop Navigation (Top Bar) */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User / Login Area */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div>
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-[11px] sm:text-xs font-bold shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      {user.role === "ADMIN" ? "Admin" : "Bendahara"}
                    </span>
                  </div>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      title="Logout"
                      className="p-1.5 sm:p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login <span className="hidden sm:inline">Bendahara</span></span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Bottom Navigation on Mobile) */}
      <nav
        aria-label="Navigasi Bawah Seluler"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] no-print"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all duration-200 select-none ${
                  isActive
                    ? "text-blue-600 font-bold scale-105"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
