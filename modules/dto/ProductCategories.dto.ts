import { z } from "zod";

export const createProductCategoriesSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    // Terima URL absolut atau path internal (`/uploads/...`) dari UploadService.
    image: z.string().min(1).optional(),
});

export const updateProductCategoriesSchema = createProductCategoriesSchema.partial();

export type CreateProductCategoriesDto = z.infer<typeof createProductCategoriesSchema>;
export type UpdateProductCategoriesDto = z.infer<typeof updateProductCategoriesSchema>;
