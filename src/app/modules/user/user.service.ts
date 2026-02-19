import { Role } from "../../../generated/prisma/enums";
import { UserCreateInput } from "../../../generated/prisma/models";
import { permissions } from "../../config/permissions";
import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import { hashPassword } from "../../utils/bcrypt";
import { userRepository } from "./user.repository";

const getUsersFromDB = async () => {
  const users = await userRepository.findAll()
  return users
};

const createUser = async (payload: UserCreateInput) => {

  payload.password = await hashPassword(payload.password)

  const res = await userRepository.create(payload)
  return res
}

const createAdmin = async (payload: UserCreateInput) => {

  payload.password = await hashPassword(payload.password)
  payload.role = Role.ADMIN
  payload.needPasswordChange = true

  const res = await userRepository.create(payload)
  return res
}

const getUserWithPermissions = async (email: string) => {

  const user = await userRepository.findByEmail(email);

  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "User no longer exists");

  const rolePermissions = permissions.getPermissionsForRole(user.role)

  return {
    id: user.id,
    email,
    status: user.status,
    role: user.role,
    deletedAt: user.deletedAt,
    permissions: rolePermissions
  }
}

export const userService = {
  getUsersFromDB,
  createUser,
  createAdmin,
  getUserWithPermissions
};
