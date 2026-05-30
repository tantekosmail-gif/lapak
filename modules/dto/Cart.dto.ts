import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.number().int().positive(),
    qty: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
    // 0 = item dihapus dari cart.
    qty: z.number().int().min(0),
});

export type AddToCartDto = z.infer<typeof addToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
