export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 py-6 text-center text-xs text-slate-400 border-t border-slate-200/80 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p>&copy; {currentYear} Kas Low Kort1sol. Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
