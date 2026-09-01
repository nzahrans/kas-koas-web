const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Buat User Bendahara / Admin Default
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "bendahara" },
    update: {},
    create: {
      username: "bendahara",
      name: "dr. Naufal Zahran (Bendahara)",
      password: hashedPassword,
      role: "BENDAHARA",
    },
  });
  console.log("Admin user created/verified:", admin.username);

  // 2. Buat Contoh Data Anggota Koas
  const sampleMembers = [
    { name: "dr. Naufal Zahran S.", nim: "20260101", phone: "082117442441" },
    { name: "dr. Ahmad Fauzi", nim: "20260102", phone: "081234567891" },
    { name: "dr. Sarah Amalia", nim: "20260103", phone: "081234567892" },
    { name: "dr. Budi Santoso", nim: "20260104", phone: "081234567893" },
    { name: "dr. Cindy Clarissa", nim: "20260105", phone: "081234567894" },
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

    await prisma.transaction.createMany({
      data: [
        {
          type: "INCOME",
          amount: 500000,
          category: "Uang Kas Awal Stase",
          payerPayee: "Iuran Seluruh Anggota (5 orang)",
          notes: "Iuran kas awal masuk stase bedah / interna",
          recorderName: "dr. Naufal Zahran",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          type: "INCOME",
          amount: 50000,
          category: "Iuran Mingguan / Bulanan",
          payerPayee: firstMember?.name || "dr. Naufal Zahran S.",
          memberId: firstMember?.id || null,
          notes: "Iuran kas minggu ke-1",
          recorderName: "dr. Naufal Zahran",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          type: "EXPENSE",
          amount: 75000,
          category: "Alat Medis (Spuit, Handscoon, dsb)",
          payerPayee: "Apotek Kimia Farma",
          notes: "Beli spuit 3cc, 5cc, dan handscoon steril untuk tindakan",
          recorderName: "dr. Naufal Zahran",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          type: "EXPENSE",
          amount: 45000,
          category: "Fotokopi / Cetak Modul / Status Pasien",
          payerPayee: "Percetakan Kampus",
          notes: "Cetak format lembar status pasien & logbook stase",
          recorderName: "dr. Naufal Zahran",
          date: new Date(),
        },
      ],
    });
    console.log("Sample initial transactions created.");
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
