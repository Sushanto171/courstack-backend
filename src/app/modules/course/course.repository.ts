import { CourseCreateInput, CourseUpdateInput } from "../../../generated/prisma/models"
import { prisma } from "../../config/prisma"

const create = (data: CourseCreateInput) => {
  return prisma.course.create({ data })
}
const getAll = () => {
  return prisma.course.findMany()
}
const getBySlug = (slug: string) => {
  return prisma.course.findUnique({ where: { slug } })
}
const updateById = (id: string, data: CourseUpdateInput) => {
  return prisma.course.update({ where: { id }, data })
}
const softDeleteByID = (id: string,) => {
  const now = new Date(Date.now())
  return prisma.course.update({ where: { id }, data: { deletedAt: now } })
}

export const courseRepository = { create, getAll, getBySlug, updateById, softDeleteByID }