import { Product } from "@/app/types/product";
import Image from "next/image";
import Link from "next/link";

const formatRupiah = (value: number) =>
  `Rp ${value.toLocaleString("id-ID")}`;

export const ProductCard = ({
  name,
  imageUrl = "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
  price,
  regular_price,
  slug,
}: Product) => {
  const url = `/products/${slug}`;
  // Tampilkan harga coret hanya jika harga normal benar-benar lebih tinggi.
  const showStrike =
    typeof regular_price === "number" && regular_price > price;

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
          <h2 className="text-lg font-semibold uppercase">{name}</h2>
          <div className="flex items-baseline gap-2">
            <p className="text-xs font-bold text-green-500">
              {formatRupiah(price)}
            </p>
            {showStrike && (
              <p className="text-[11px] text-muted line-through">
                {formatRupiah(regular_price!)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
