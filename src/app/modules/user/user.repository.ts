import { UserCreateInput } from "../../../generated/prisma/models";
import { prisma } from "../../config/prisma";

const create = (data: UserCreateInput) => {
  return prisma.user.create({ data });
};

const findAll = () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    omit: {
      password: true
    }
  });
};

const findByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const userRepository = {
  create,
  findAll,
  findByEmail
};