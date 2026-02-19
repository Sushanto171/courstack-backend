import { Role, UserStatus } from "../../../generated/prisma/enums";
import { UserCreateInput } from "../../../generated/prisma/models";
import { permissions } from "../../config/permissions";
import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import { hashPassword } from "../../utils/bcrypt";
import { userRepository } from "./user.repository";

const getUsersFromDB = async (role: Role) => {

  const users = await userRepository.findAll({
    allowedRoles: role === Role.ADMIN ? [Role.INSTRUCTOR, Role.STUDENT] : [],
  })

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

interface IGetUserWithPermission {
  id: string;
  email: string;
  status: UserStatus;
  role: Role;
  deletedAt: Date | null;
  permissions: string[];
}

const getUserWithPermissions = async (email: string): Promise<IGetUserWithPermission> => {

  // const cacheKey = `auth:user:${email}`;

  // const cached = await redisClient?.get(cacheKey);
  // return from cache
  // if (cached) return JSON.parse(cached);

  const isExist = await userRepository.findByEmail(email);

  if (!isExist) throw new ApiError(httpStatus.UNAUTHORIZED, "User no longer exists");

  const rolePermissions = permissions.getPermissionsForRole(isExist.role)

  const user = {
    id: isExist.id,
    email,
    status: isExist.status,
    role: isExist.role,
    deletedAt: isExist.deletedAt,
    permissions: rolePermissions
  }

  // store cache
  // await redisClient?.set(cacheKey, JSON.stringify(user), { expiration: { type: "EX", value: 900 } });

  return user
}

export const userService = {
  getUsersFromDB,
  createUser,
  createAdmin,
  getUserWithPermissions
};
