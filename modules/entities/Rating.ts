import type { Rating, User } from "@/app/generated/prisma/client";

export type RatingEntity = Rating;

/** Rating dengan info reviewer (untuk ditampilkan publik). */
export type RatingWithUser = Rating & {
  user: Pick<User, "id" | "name" | "image">;
};

export type RatingSummary = {
  productId: number;
  average: number; // 0 bila tidak ada rating
  count: number;
};
