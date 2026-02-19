import { UserCreateInput } from "../../../generated/prisma/models";
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

export const userService = {
  getUsersFromDB,
  createUser
};
