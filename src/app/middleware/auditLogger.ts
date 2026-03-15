import { NextFunction, Request, Response } from "express";
import { authLog } from "../utils/logs";

export const auditLogger = (event: string) => (request: Request, response: Response, next: NextFunction) => {
  const ip = (request.headers['x-forwarded-for'] as string) || request.socket.remoteAddress || '';

  response.on('finish', async () => {
    const success = response.statusCode < 400;
    const level = success ? 'info' : 'error';
    const fullEvent = success ? `${event}:success` : `${event}:failed`;

    authLog({
      event: fullEvent,
      level,
      ip,
      email: request.body?.email,
      userId: request.user?.id,
      status: response.statusCode,
    });

    next()
  })
}