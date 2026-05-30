import { z } from "zod";
import { createProductCategoriesSchema } from "./ProductCategories.dto";

export const productStatusEnum = z.enum(["AKTIF", "HABIS", "NONAKTIF"]);

export const createProductSchema = z.object({
    name: z.string().min(1),
    price: z.number().int().nonnegative(),
    regular_price: z.number().int().nonnegative(),
    stock: z.number().int().nonnegative().optional(),
    sold: z.number().int().nonnegative().optional(),
    // Terima URL absolut (https://...) atau path internal (`/uploads/...`)
    // yang dihasilkan UploadService.
    imageUrl: z.string().min(1).optional(),
    status: productStatusEnum.optional(),
    slug: z.string().min(1).optional(),
    categoryId: z.number().int().positive().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const saveAllProductSchema = z.object({
    category: createProductCategoriesSchema,
    product: createProductSchema.omit({ categoryId: true }),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type SaveAllProductDto = z.infer<typeof saveAllProductSchema>;
