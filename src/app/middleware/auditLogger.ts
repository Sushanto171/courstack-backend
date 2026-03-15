/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { saveLog } from "../utils/dbLogger";
import { authLog } from "../utils/logs";

export const auditLogger = (event: string, category = 'auth') => (request: Request, response: Response, next: NextFunction) => {
  const ip = (request.headers['x-forwarded-for'] as string) || request.socket.remoteAddress || '';

  let errMessage: string | undefined
  const originalJson = response.json.bind(response);

  response.json = ((body: any) => {
    if (response.statusCode >= 400) {
      errMessage = body?.message || ""
    }
    return originalJson(body)
  })

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
      ...(!success && { reason: errMessage })
    });

    saveLog({
      category,
      event,
      level,
      userId: request.user?.id,
      meta: {
        ip,
        email: request.body?.email,
        status: response.statusCode,
        ...(!success && { reason: errMessage }),
      }
    })

    next()
  })
}