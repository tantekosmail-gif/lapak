// import { prisma } from '@/lib/prisma'

interface Props {
  params: {
    slug: string;
  };
}

export default async function StorePage({ params }: Props) {
  //   const store = await prisma.store.findUnique({
  //     where: {
  //       slug: params.slug,
  //     },
  //     include: {
  //       products: true,
  //     },
  //   })

  const store = {
    name: "Toko Baju Online",
    description: "Toko baju online dengan berbagai pilihan fashion terkini.",
    phone: "6281234567890",
    products: [
      {
        id: 1,
        name: "Kaos Polos",
        price: 50000,
      },
      {
        id: 2,
        name: "Kemeja Lengan Panjang",
        price: 150000,
      },
      {
        id: 3,
        name: "Jaket Denim",
        price: 250000,
      },
    ],
  };

  if (!store) {
    return <div>Toko tidak ditemukan</div>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-bold">{store.name}</h1>

      <p className="mt-4 text-gray-600">{store.description}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {store.products.map((product) => (
          <div key={product.id} className="rounded-2xl border p-4">
            <h2 className="font-semibold">{product.name}</h2>

            <p className="mt-2">Rp {product.price}</p>

            <a
              href={`https://wa.me/${store.phone}`}
              className="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              Order WhatsApp
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
