import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

/**
 * Data kategori produk untuk seeding.
 *
 * `slug` disimpan sebagai metadata referensi — kolom `slug` belum ada di
 * model `ProductCategories` di schema saat ini, jadi field itu di-ignore
 * saat insert. Hapus baris ini kalau nanti slug ditambahkan ke schema.
 */
export const categories = [
  {
    name: "Batik Tulis",
    slug: "batik-tulis",
    image:
      "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Batik Cap",
    slug: "batik-cap",
    image:
      "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Batik Print",
    slug: "batik-print",
    image:
      "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Aksesoris",
    slug: "aksesoris",
    image:
      "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Pakaian",
    slug: "pakaian",
    image:
      "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Souvenir",
    slug: "souvenir",
    image:
      "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

/**
 * Seed idempotent: skip kategori yang sudah ada (cocok by `name`).
 * Bisa dipanggil ulang berkali-kali tanpa duplikasi.
 */
export async function seedCategories(prisma: PrismaClient) {
  let created = 0;
  let skipped = 0;
  for (const { name, image } of categories) {
    const existing = await prisma.productCategories.findFirst({
      where: { name },
    });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.productCategories.create({ data: { name, image } });
    created++;
  }
  return { created, skipped };
}

// Jalan sebagai script langsung (`npx prisma db seed`), bukan saat di-import.
if (require.main === module) {
  (async () => {
    const adapter = new PrismaPg({
      connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    });
    const prisma = new PrismaClient({ adapter });
    try {
      const result = await seedCategories(prisma);
      console.log(
        `Categories seeded: ${result.created} created, ${result.skipped} skipped`,
      );
    } finally {
      await prisma.$disconnect();
    }
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
