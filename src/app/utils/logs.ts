import { logger } from "./logger"

export const httpLog = (data: object) => {
  logger.info({ category: "http", ...data })
}