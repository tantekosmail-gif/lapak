import { z } from "zod";

export const orderItemInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

// Payload customer: cukup daftar item. Harga & total dihitung server dari DB.
export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1),
});

// Payload admin: sama, tapi wajib menyebut customer yang dibuatkan order.
export const createOrderAdminSchema = createOrderSchema.extend({
  customerId: z.number().int().positive(),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type CreateOrderAdminDto = z.infer<typeof createOrderAdminSchema>;
