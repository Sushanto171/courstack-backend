import z from "zod";

const loginSchema = z.object({
  email: z
    .email('Invalid email format')
    .toLowerCase()
    .trim(),

  password: z
    .string('Password is required')
    .min(1, 'Password is required'),
});

export const authValidation = {
  loginSchema
}

type Login = z.infer<typeof loginSchema>;

export type { Login };