import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-8">
      <Navbar user={session ? { name: session.name, role: session.role } : null} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {children}
      </main>
      <footer className="mt-12 py-6 text-center text-xs text-slate-400 border-t border-slate-200 no-print">
        Website Pencatatan Kas Koas &copy; 2026 &bull; Transparan, Terstruktur & Akuntabel
      </footer>
    </div>
  );
}
