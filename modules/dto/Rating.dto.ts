import { z } from "zod";

export const createRatingSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(2000).optional(),
});

export type CreateRatingDto = z.infer<typeof createRatingSchema>;
