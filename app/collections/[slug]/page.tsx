import { ProductCard } from "@/app/components/ui/card/ProductCard";

const products = [
  {
    id: 1,
    slug: "product-1",
    name: "Product 1",
    imageUrl:
      "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
    price: 10000,
  },
  {
    id: 2,
    slug: "product-2",
    name: "Product 2",
    imageUrl:
      "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
    price: 20000,
  },
  {
    id: 3,
    slug: "product-3",
    name: "Product 3",
    imageUrl:
      "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
    price: 30000,
  },
  {
    id: 4,
    slug: "product-4",
    name: "Product 4",
    imageUrl:
      "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
    price: 40000,
  },
];

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="uppercase font-bold text-xl">{slug}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(({ id, name, price, imageUrl, slug }) => (
          <ProductCard
            key={id}
            name={name}
            price={price}
            imageUrl={imageUrl}
            slug={slug}
            id={id}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
