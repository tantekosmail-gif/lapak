import type { ProductCategories, Product } from "@/app/generated/prisma/client";


export type ProductCategoryEntity = ProductCategories;
export type ProductCategoryWithProducts = ProductCategories & { products: Product[] };
export type ProductCategoryListItem = ProductCategories & {
  _count?: { products: number };
};
