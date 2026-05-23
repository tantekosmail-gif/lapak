import { z } from "zod";

export const attachProductImageMetaSchema = z.object({
    productId: z.coerce.number().int().positive(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
    isPrimary: z
        .union([z.boolean(), z.enum(["true", "false"])])
        .transform((v) => v === true || v === "true")
        .optional(),
});

export const detachProductImageSchema = z.object({
    ids: z.array(z.number().int().positive()).min(1),
});

export type AttachProductImageMeta = z.infer<typeof attachProductImageMetaSchema>;
export type DetachProductImageDto = z.infer<typeof detachProductImageSchema>;
