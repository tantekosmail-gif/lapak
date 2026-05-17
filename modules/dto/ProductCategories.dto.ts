import { z } from "zod";

export const createProductCategoriesSchema = z.object({
    name: z.string().min(1),
    image: z.string().url().optional(),
});

export const updateProductCategoriesSchema = createProductCategoriesSchema.partial();

export type CreateProductCategoriesDto = z.infer<typeof createProductCategoriesSchema>;
export type UpdateProductCategoriesDto = z.infer<typeof updateProductCategoriesSchema>;
