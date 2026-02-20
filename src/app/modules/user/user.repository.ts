import { Role } from "../../../generated/prisma/enums";
import { UserCreateInput, UserUpdateInput, UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../config/prisma";

interface FindAllOptions {
  cursor?: string;
  limit?: number;
  q?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  allowedRoles?: Role[];
}

const create = (data: UserCreateInput) => {
  return prisma.user.create({
    data,
    omit: { password: true }
  });
};

const findAll = (options: FindAllOptions) => {

  const { allowedRoles } = options;

  const where: UserWhereInput = {}

  if (allowedRoles && allowedRoles.length > 0) {
    where.role = {
      in: allowedRoles.map(role => role)
    };
  }

  return prisma.user.findMany({
    where,
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

const findByID = (id: string, omitPassword = true) => {
  return prisma.user.findUnique({
    where: { id },
    omit: {
      password: omitPassword
    }
  });
};

const updateByEmail = (email: string, payload: UserUpdateInput) => {
  return prisma.user.update({
    where: { email },
    data: payload,
    omit: {
      password: true
    }
  })
}

export const userRepository = {
  create,
  findAll,
  findByEmail,
  updateByEmail,
  findByID
};