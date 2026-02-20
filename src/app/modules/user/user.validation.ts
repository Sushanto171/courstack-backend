import z from "zod";
import { Gender, Role, UserStatus } from "../../../generated/prisma/enums";

export const bdPhoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+880|880|0)?1[3-9]\d{8}$/, "Invalid Bangladesh phone number");

const createUser = z.object({
  name: z
    .string('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),

  email: z.email('Invalid email format')
    .toLowerCase()
    .trim(),

  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must not exceed 32 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  role: z.enum([Role.STUDENT, Role.INSTRUCTOR]).optional(),
  gender: z.enum(Object.keys(Gender)).optional(),

})


const updateUser = z.object({
  name: z
    .string('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim().optional(),
  role: z.enum([Role.STUDENT, Role.INSTRUCTOR]).optional(),
  gender: z.enum(Object.keys(Gender)).optional(),
  phone: bdPhoneSchema.optional(),
  // status: z.enum(Object.keys(UserStatus)).optional()
})

const updateUserStatusSchema = z.object({
  email: z.email('Invalid email format')
    .toLowerCase()
    .trim(),
  status: z.enum(Object.keys(UserStatus)),
});

export type UpdateUserStatus = z.infer<typeof updateUserStatusSchema>

export const userValidation = {
  createUser, updateUser,
  updateUserStatusSchema
};

