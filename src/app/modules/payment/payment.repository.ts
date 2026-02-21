import { PaymentCreateInput } from "../../../generated/prisma/models"
import { prisma } from "../../config/prisma"

const create = (data: PaymentCreateInput) => {
  return prisma.payment.create({ data })
}


export const paymentRepository = { create }

