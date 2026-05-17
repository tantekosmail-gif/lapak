import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  image: z.string().url().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const upsertGoogleUserSchema = z.object({
  email: z.string().email(),
  name: z.string().nullish(),
  image: z.string().url().nullish(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UpsertGoogleUserDto = z.infer<typeof upsertGoogleUserSchema>;
