import type {
  Product,
  ProductCategories,
  ProductImage,
} from "@/app/generated/prisma/client";

export type ProductEntity = Product;
export type ProductWithCategory = Product & { category: ProductCategories | null };
export type ProductDetail = Product & {
  category: ProductCategories | null;
  images: ProductImage[];
};
