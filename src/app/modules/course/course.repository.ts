import { CourseStatus } from "../../../generated/prisma/enums";
import { CourseCreateInput, CourseUpdateInput, CourseWhereInput, CourseWhereUniqueInput } from "../../../generated/prisma/models";
import { prisma } from "../../config/prisma";

interface IGetAllOptions {
  instructorId?: string,
  isDeleted?: boolean,
  takeInstructorInfo?: boolean,
  takeDraftCourse?: boolean
}

const getAll = (options: IGetAllOptions) => {
  const { instructorId, isDeleted = false, takeInstructorInfo = true, takeDraftCourse = false } = options;

  const where: CourseWhereInput = {
    deletedAt: isDeleted ? { not: null } : null,
    status: takeDraftCourse ? undefined : { not: CourseStatus.DRAFT },
    ...(instructorId && { instructorId })
  }

  return prisma.course.findMany(
    {
      where,
      include: takeInstructorInfo ?
        {
          instructor: {
            select: {
              id: true,
              name: true,
              photoURL: true
            }
          }
        } : undefined
    }
  )
}

const create = (data: CourseCreateInput) => {
  return prisma.course.create({ data })
}
const getBySlug = (slug: string) => {
  return prisma.course.findUnique({
    where: { slug }, include: {
      instructor: {
        select: {
          id: true,
          name: true,
          photoURL: true
        }
      }
    }
  })
}

const getByID = (id: string) => {
  return prisma.course.findUnique({ where: { id } })
}
const updateById = (id: string, data: CourseUpdateInput) => {
  return prisma.course.update({ where: { id }, data })
}
const softDeleteByID = (id: string,) => {
  const now = new Date(Date.now())
  return prisma.course.update({ where: { id }, data: { deletedAt: now } })
}

const getOneCourse = (where: CourseWhereUniqueInput) => {
  return prisma.course.findUnique({ where })
}

export const courseRepository = { create, getAll, getBySlug, updateById, softDeleteByID, getByID, getOneCourse }