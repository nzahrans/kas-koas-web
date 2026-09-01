# 🩺 Kas Koas FKH - Sistem Pencatatan Keuangan Dokter Hewan Muda

Sistem web modern pencatatan kas internal kelompok dokter hewan muda (Koas Kedokteran Hewan / PPDH) yang transparan, responsif di layar smartphone/HP saat stase klinik/lapangan, dan **100% Bebas Biaya Operasional (Rp 0 / Free Tier Selamanya)**.

---

## 🚀 Fitur Utama
1. **Dashboard Ringkasan Saldo:** Menampilkan Sisa Saldo Kas, Total Pemasukan, Total Pengeluaran secara real-time.
2. **Pencatatan Pemasukan (Iuran):** Form digital mencatat uang kas rutin, uang awal stase, dan iuran tindakan operasi.
3. **Pencatatan Pengeluaran:** Form digital mencatat belanja kebutuhan stase FKH (alat medis & bedah, obat hewan, pakan pasien/kandang, modul rekam medis).
4. **Fitur Salin Rekap Kas (1-Click):** Tombol praktis untuk menyalin format rekap laporan kas siap kirim ke grup chat kelompok (WhatsApp, Telegram, Discord, LINE).
5. **Riwayat Rekapitulasi & Audit:** Tabel mutasi kas lengkap dengan filter tipe, pencarian, serta tombol cetak laporan PDF.
6. **Daftar Anggota Koas FKH:** Rekap iuran per anggota kelompok dokter hewan muda.
7. **Akses Bertingkat:**
   - **Anggota Koas (Public/View-Only):** Bisa langsung melihat saldo & riwayat tanpa login.
   - **Bendahara / Admin:** Login untuk menambah, mengedit, atau menghapus catatan kas.

---

## 🛠️ Tech Stack
- **Frontend & Backend:** [Next.js (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM:** [Supabase (PostgreSQL)](https://supabase.com/) + [Prisma ORM](https://prisma.io/)
- **Hosting & Deployment:** [Vercel](https://vercel.com/) (Hobby / Free Tier)

---

## ⚡ Panduan Setup & Menjalankan Lokal

### 1. Salin Environment Variables
```bash
cp .env.example .env
```
Isi `DATABASE_URL` dan `DIRECT_URL` dari akun Supabase Anda (*Project Settings -> Database*).

### 2. Sinkronkan Database & Seed Data Awal
```bash
npm run db:push
npm run db:seed
```
*Akun Login Bendahara Bawaan:*
- **Username:** `bendahara`
- **Password:** `admin123`

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🌐 Panduan Deployment ke Vercel (Gratis Rp 0)

1. Buat repository baru di **GitHub** dan push source code ini.
2. Buka [Vercel](https://vercel.com/) dan import repository GitHub Anda.
3. Tambahkan **Environment Variables** di Vercel:
   - `DATABASE_URL` = *(dari Supabase)*
   - `DIRECT_URL` = *(dari Supabase)*
   - `JWT_SECRET` = `kunci-rahasia-anda`
4. Klik **Deploy**. Website siap digunakan oleh seluruh kelompok koas!
