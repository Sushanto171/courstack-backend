import { EnrollmentCreateInput, EnrollmentSelect, EnrollmentWhereUniqueInput } from "../../../generated/prisma/models"
import { prisma } from "../../config/prisma"

const getOne = (where: EnrollmentWhereUniqueInput, select?: EnrollmentSelect) => {
  return prisma.enrollment.findUnique({ where, select })
}

const getMany = (studentId: string) => {
  return prisma.enrollment.findMany({
    where: { studentId },
    select: {
      id: true,
      enrolledAt: true,
      lastAccessAt: true,
      lastAccessLessonOrder: true,
      status: true,
      _count: {
        select: {
          lessonProgress: true
        }
      },
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          slug: true,
          overview: true,
          status: true,
          price: true,
          _count: {
            select: {
              lessons: true
            }
          },
          category: {
            select: {
              name: true,
            }
          }
        }
      }
    }
  })

}

const create = (data: EnrollmentCreateInput) => {
  return prisma.enrollment.create({ data })
}

export const enrollRepository = { create, getOne, getMany }