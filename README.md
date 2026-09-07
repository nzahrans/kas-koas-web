# 🩺 Kas Low Kort1sol

Aplikasi web pembukuan kas transparan untuk kelompok dokter hewan muda (Koas Kedokteran Hewan / PPDH). Mendukung pencatatan terpisah antara **Kas Kelompok** dan **Kas Gelombang**, responsif di layar smartphone, dan dapat diinstal sebagai PWA (Progressive Web App).

---

## 🚀 Fitur Utama

- **Dual Kas System:** Pemisahan saldo & transaksi secara otomatis antara **Kas Kelompok** dan **Kas Gelombang**.
- **Pencatatan Pemasukan:** Form setoran kas dengan dukungan multi-pilih anggota (tag), nominal otomatis berformat rupiah, dan pencatatan nama penyetor non-anggota.
- **Pencatatan Pengeluaran:** Form belanja kebutuhan koas/stase klinis (alat medis, obat hewan, pakan, percetakan modul) dengan pengelompokan kas yang jelas.
- **Salin Rekap 1-Klik:** Format laporan ringkasan kas yang siap disalin dan dikirim langsung ke grup chat WhatsApp/Telegram.
- **Manajemen Anggota:** Kelola daftar anggota aktif, riwayat kontribusi, dan status keikutsertaan.
- **Role & Keamanan:** Akses publik transparan untuk melihat saldo dan riwayat, serta sistem otentikasi aman untuk akses input data Bendahara.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **UI & Styling:** React 19, [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Database & ORM:** [Supabase](https://supabase.com/) (PostgreSQL) + [Prisma ORM](https://prisma.io/)
- **Deployment:** [Vercel](https://vercel.com/) (Region: Singapore `sin1`)

---

## ⚡ Setup Lokal

1. **Clone repository & install dependencies:**
   ```bash
   git clone https://github.com/nzahrans/kas-koas-web.git
   cd kas-koas-web
   npm install
   ```

2. **Konfigurasi Environment Variables:**
   Buat file `.env` di root project:
   ```env
   DATABASE_URL="postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://...pooler.supabase.com:5432/postgres"
   JWT_SECRET="kunci-rahasia-jwt"
   ```

3. **Inisialisasi Database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

