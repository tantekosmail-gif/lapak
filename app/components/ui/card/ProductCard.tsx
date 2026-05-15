import { Product } from "@/app/types/product";
import Image from "next/image";
import Link from "next/link";

export const ProductCard = ({
  id,
  name,
  imageUrl = "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
  price,
  slug,
}: Product) => {
  const url = `/products/${slug}`;
  return (
    <div className="flex flex-col justify-end">
      <Link href={url}>
        <Image
          src={imageUrl}
          alt={name}
          width={200}
          height={600}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold uppercase">
            {name}
          </h2>
          <p className="text-xs font-bold text-green-500">
            Rp {price.toLocaleString("id-ID")}
          </p>
        </div>
      </Link>
    </div>
  );
};
