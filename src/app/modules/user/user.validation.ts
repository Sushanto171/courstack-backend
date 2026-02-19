import z from "zod";
import { Gender, UserStatus } from "../../../generated/prisma/enums";

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

  gender: z.enum(Object.keys(Gender)).optional(),

})


const updateUser = {
  params: {
    id: "string|uuid"
  },
  body: {
    email: "string|email",
    name: "string|min:2|max:100",
    password: "string|min:6|max:100"
  }
}

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

