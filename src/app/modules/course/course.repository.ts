import { CourseCreateInput, CourseUpdateInput, CourseWhereInput, CourseWhereUniqueInput } from "../../../generated/prisma/models";
import { prisma } from "../../config/prisma";
import { pickPagination } from "../../utils/pick";
import { ICourseQuery } from "./course.validation";



const getAll = async (query: ICourseQuery,) => {

  const { take, skip, order, page, sortBy, rest } = pickPagination(query);
  const { status, includeDeleted, categoryId, instructorId, search, minDuration, minPrice, maxPrice, maxDuration } = rest


  const where: CourseWhereInput = {
    ...(status?.length && { status: { in: status } }),
    deletedAt: includeDeleted ? { not: null } : null,
    ...(categoryId && { categoryId }),
    ...(instructorId && { instructorId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { overview: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...((minDuration || maxDuration) && {
      durationMinutes: {
        ...(minDuration && { gte: minDuration }),
        ...(maxDuration && { lte: maxDuration }),
      },
    }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      },
    }),
  };
  const [data, total] = await prisma.$transaction([
    prisma.course.findMany({
      where,
      include: { instructor: { select: { id: true, name: true, photoURL: true } } },
      take,
      skip,
      orderBy: { [sortBy]: order }
    }),

    prisma.course.count({ where })
  ]);


  const meta = {
    limit: take,
    page,
    total,
    totalPages: Math.ceil(total / take)
  }
  return { data, meta }
}

const create = (data: CourseCreateInput) => {
  return prisma.course.create({ data })
}

const getBySlug = (slug: string) => {
  return prisma.course.findUnique({
    where: { slug },
    include: {
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

const getOneCourse = (where: CourseWhereUniqueInput
) => {
  return prisma.course.findUnique({ where })
}

export const courseRepository = { create, getAll, getBySlug, updateById, softDeleteByID, getByID, getOneCourse }