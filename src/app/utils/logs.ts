import { logger } from "./logger";

export const httpLog = (data: object) =>
  logger.info({ category: 'http', ...data });

export const authLog = (data: object) =>
  logger.info({ category: 'auth', ...data });

export const emailLog = (data: object) =>
  logger.info({ category: 'email', ...data });

export const errorLog = (data: object) =>
  logger.error({ category: 'error', ...data });

export const dbLog = (data: object) =>
  logger.debug({ category: 'db', ...data });