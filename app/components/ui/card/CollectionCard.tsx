import { Collection } from "@/app/types/collection";
import Image from "next/image";
import Link from "next/link";

export const CollectionCard = ({
  name,
  url,
  imageUrl = "https://picsum.photos/seed/picsum/200/300",
}: Collection) => {
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
        <h2 className="text-lg font-semibold justify-self-center uppercase">
          {name}
        </h2>
      </Link>
    </div>
  );
};
