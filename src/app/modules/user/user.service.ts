import { UserCreateInput } from "../../../generated/prisma/models";
import { userRepository } from "./user.repository";

const getUsersFromDB = async () => {
  const users = await userRepository.findAll()
  return users
};

const createUser = async (payload: UserCreateInput) => {
  const res = await userRepository.create(payload)
  return res
}

export const userService = {
  getUsersFromDB,
  createUser
};
