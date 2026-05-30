import type { Product, ProductCategories } from "@/app/generated/prisma/client";

export type ProductEntity = Product;
export type ProductWithCategory = Product & { category: ProductCategories | null };
