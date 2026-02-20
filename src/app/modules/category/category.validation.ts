import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string('Category name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
});



export type ICategory = z.infer<typeof categorySchema>;

export const categoryValidation = { categorySchema }