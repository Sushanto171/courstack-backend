/* eslint-disable @typescript-eslint/no-unused-vars */
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { UserCreateInput, UserUpdateInput } from "../../../generated/prisma/models";
import { permissions } from "../../config/permissions";
import redisClient from "../../config/redis";
import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import { invalidateUserCache } from "../../helper/invalidateUserCache";
import { IAuthUser } from "../../types";
import { hashPassword } from "../../utils/bcrypt";
import { userRepository } from "./user.repository";
import { IUserQuery, UpdateUserStatus } from "./user.validation";

interface IGetUserWithPermission {
  id: string;
  email: string;
  status: UserStatus;
  role: Role;
  deletedAt: Date | null;
  permissions: string[];
}

const getUsersFromDB = async (authRole: Role, query:IUserQuery) => {

  const users = await userRepository.findAll(query)

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

const updateStatus = async (authRole: Role, payload: UpdateUserStatus) => {
  const isExist = await userRepository.findByEmail(payload.email);

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "User not found!");

  if (authRole === Role.ADMIN && !(isExist.role === Role.INSTRUCTOR || isExist.role === Role.STUDENT)) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden access!")

  const res = await userRepository.updateByEmail(isExist.email, { status: payload.status as UserStatus });

  await invalidateUserCache(res.email)

  return res
}

const updateUser = async (
  authUser: IAuthUser,
  id: string,
  payload: UserUpdateInput
) => {
  const isSuperAdmin = authUser.role === Role.SUPER_ADMIN;
  const isOwner = authUser.id === id;

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }


  const existingUser = await userRepository.findByID(id);

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // sanitize payload based on permission
  let sanitizedPayload: UserUpdateInput;

  if (isSuperAdmin) {

    const { id: _, password, ...rest } = payload;
    sanitizedPayload = rest;

  } else {

    // owner: allow only safe editable fields
    const { name, photoURL, gender, phone } = payload;

    sanitizedPayload = { name, photoURL, gender, phone };
  }


  const user = await userRepository.updateByEmail(existingUser.email, sanitizedPayload)

  return user;
};

const getUserWithPermissions = async (email: string): Promise<IGetUserWithPermission> => {

  const cacheKey = `auth:user:${email}`;

  const cached = await redisClient?.get(cacheKey);
  // return from cache
  if (cached) return JSON.parse(cached);

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
  await redisClient?.set(cacheKey, JSON.stringify(user), { expiration: { type: "EX", value: 900 } });

  return user
}

export const userService = {
  getUsersFromDB,
  createUser,
  createAdmin,
  getUserWithPermissions,
  updateStatus,
  updateUser
};
