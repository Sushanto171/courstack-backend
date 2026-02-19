import { UserCreateInput } from "../../../generated/prisma/models";
import { prisma } from "../../config/prisma";

const create = (data: UserCreateInput) => {
  return prisma.user.create({
    data,
    omit: { password: true }
  });
};

const findAll = () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    omit: {
      password: true
    }
  });
};

const findByEmail = (email: string, omitPassword = true) => {
  return prisma.user.findUnique({
    where: { email },
    omit: {
      password: omitPassword
    }
  });
};

export const userRepository = {
  create,
  findAll,
  findByEmail
};