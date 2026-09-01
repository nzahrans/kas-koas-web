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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Kelompok Info */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base leading-tight block">Kas Koas</span>
              <span className="text-[11px] text-blue-600 font-medium leading-none block">Dokter Muda</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
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
                      ? "bg-blue-50 text-blue-700"
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
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-blue-600">
                    {user.role}
                  </div>
                </div>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    title="Logout"
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login Bendahara
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-1.5 flex justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
                isActive ? "text-blue-600 font-bold" : "text-slate-500"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
