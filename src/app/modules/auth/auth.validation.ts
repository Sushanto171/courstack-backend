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

const verifySchema = z.object({
  otp: z.string("OTP is required").length(6, "OTP must be 6 digit")
})

export const authValidation = {
  loginSchema,
  verifySchema
}

type Login = z.infer<typeof loginSchema>;
type IVerifyOtp = z.infer<typeof verifySchema>;

export type { IVerifyOtp, Login };

