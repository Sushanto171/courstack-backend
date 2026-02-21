import { EnrollmentCreateInput, EnrollmentSelect, EnrollmentWhereUniqueInput } from "../../../generated/prisma/models"
import { prisma } from "../../config/prisma"

const getOne = (where: EnrollmentWhereUniqueInput, select: EnrollmentSelect) => {
  return prisma.enrollment.findUnique({ where, select })
}

const create = (data: EnrollmentCreateInput) => {
  return prisma.enrollment.create({ data })
}

export const enrollRepository = { create, getOne }