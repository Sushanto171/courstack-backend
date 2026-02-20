import { CategoryCreateInput, CategoryUpdateInput } from "../../../generated/prisma/models";
import { prisma } from "../../config/prisma";

const create = (data: CategoryCreateInput) => {
  return prisma.category.create({ data })
}

const updateByID = (id: string, payload: CategoryUpdateInput) => {
  return prisma.category.update({
    where: { id },
    data: {
      name: payload.name,
      slug: payload.slug
    }
  })
}

const getAll = () => {
  return prisma.category.findMany({})
}

const findByID = (id: string) => {
  return prisma.category.findUnique({ where: { id } })
}
const findBySlug = (slug: string) => {
  return prisma.category.findUnique({ where: { slug } })
}

export const categoryRepository = { create, updateByID, getAll, findBySlug ,findByID}