import { prisma } from '../config/prisma';
import { logger } from './logger';

interface LogPayload {
  category: string;
  event: string;
  level: 'info' | 'error' | 'critical';
  userId?: string;
  meta?: object;
}

export const saveLog = async (payload: LogPayload) => {
  try {
    await prisma.systemLog.create({ data: payload });
  } catch {
    logger.error({ event: 'db:log:failed', payload });
  }
};