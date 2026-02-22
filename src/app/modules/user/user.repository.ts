import { UserCreateInput, UserUpdateInput, UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../config/prisma";
import { pickPagination } from "../../utils/pick";
import { IUserQuery } from "./user.validation";


const create = (data: UserCreateInput) => {
  return prisma.user.create({
    data,
    omit: { password: true }
  });
};

const findAll = async (query: IUserQuery) => {

  const { take, skip, order, page, sortBy, rest } = pickPagination(query);

  const {
    id,
    email,
    phone,
    role,
    status,
    gender,
    isVerified,
    includeDeleted,
    createdFrom,
    createdTo,
    search
  } = rest;

  const where: UserWhereInput = {
    deletedAt: includeDeleted ? { not: null } : null,
    ...(id && { id }),
    ...(email && { email: { contains: email, mode: "insensitive" } }),
    ...(phone && { phone: { contains: phone, mode: "insensitive" } }),
    ...(typeof isVerified === "boolean" && { isVerified }),
    ...(role?.length && { role: { in: role } }),
    ...(status?.length && { status: { in: status } }),
    ...(gender?.length && { gender: { in: gender } }),
    ...((createdFrom || createdTo) && {
      createdAt: {
        ...(createdFrom && { gte: createdFrom }),
        ...(createdTo && { lte: createdTo }),
      }
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ]
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      omit: {
        password: true
      },
      take,
      skip,
      orderBy: { [sortBy]: order }
    }),
    prisma.user.count({ where })
  ])

  const meta = {
    limit: take,
    page,
    total,
    totalPages: Math.ceil(total / take)
  }
  return { data, meta }
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