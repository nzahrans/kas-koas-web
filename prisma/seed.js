const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Buat User Bendahara / Admin Default
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "bendahara" },
    update: {
      name: "Bendahara",
    },
    create: {
      username: "bendahara",
      name: "Bendahara",
      password: hashedPassword,
      role: "BENDAHARA",
    },
  });
  console.log("Admin user created/verified:", admin.username);

  // 2. Buat Contoh Data Anggota Koas FKH
  const sampleMembers = [
    { name: "drh. Naufal Zahran S.", nim: "20260101", phone: "082117442441" },
    { name: "drh. Ahmad Fauzi", nim: "20260102", phone: "081234567891" },
    { name: "drh. Sarah Amalia", nim: "20260103", phone: "081234567892" },
    { name: "drh. Budi Santoso", nim: "20260104", phone: "081234567893" },
    { name: "drh. Cindy Clarissa", nim: "20260105", phone: "081234567894" },
  ];

  for (const m of sampleMembers) {
    const existing = await prisma.member.findFirst({ where: { name: m.name } });
    if (!existing) {
      await prisma.member.create({ data: m });
    }
  }
  console.log("Sample members created.");

  // 3. Buat Contoh Transaksi Awal
  const count = await prisma.transaction.count();
  if (count === 0) {
    const firstMember = await prisma.member.findFirst();
    const secondMember = await prisma.member.findFirst({
      where: { NOT: { id: firstMember ? firstMember.id : 0 } },
    });

    await prisma.transaction.createMany({
      data: [
        {
          type: "INCOME",
          kasType: "KELOMPOK",
          amount: 500000,
          category: "Uang Kas Kelompok",
          payerPayee: "Iuran Seluruh Anggota (5 orang)",
          notes: "Iuran kas awal kelompok stase klinik",
          recorderName: "drh. Naufal Zahran (Bendahara)",
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
        {
          type: "INCOME",
          kasType: "KELOMPOK",
          amount: 50000,
          category: "Uang Kas Kelompok",
          payerPayee: firstMember?.name || "drh. Naufal Zahran S.",
          memberId: firstMember?.id || null,
          notes: "Iuran kas rutin mingguan stase",
          recorderName: "drh. Naufal Zahran (Bendahara)",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          type: "INCOME",
          kasType: "GELOMBANG",
          amount: 1500000,
          category: "Uang Kas Gelombang",
          payerPayee: "Iuran Bersama Gelombang PPDH",
          notes: "Uang kas gelombang untuk kegiatan rotasi besar",
          recorderName: "drh. Naufal Zahran (Bendahara)",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          type: "EXPENSE",
          kasType: "KELOMPOK",
          amount: 85000,
          category: "Uang Kas Kelompok",
          payerPayee: "Apotek Medika Vet",
          notes: "Beli spuit 3cc, blade no.10 & handscoon steril kelompok",
          recorderName: "drh. Naufal Zahran (Bendahara)",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          type: "EXPENSE",
          kasType: "GELOMBANG",
          amount: 250000,
          category: "Uang Kas Gelombang",
          payerPayee: "Percetakan Kampus",
          notes: "Cetak buku panduan & rekam medis gelombang",
          recorderName: "drh. Naufal Zahran (Bendahara)",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          type: "EXPENSE",
          kasType: "KELOMPOK",
          amount: 35000,
          category: "Other",
          payerPayee: "Konsumsi Diskusi Kasus",
          notes: "Snack diskusi laporan kasus stase",
          recorderName: "drh. Naufal Zahran (Bendahara)",
          date: new Date(),
        },
      ],
    });
    console.log("Sample initial transactions created with Kas Kelompok & Kas Gelombang.");
  }

  console.log("Database seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
