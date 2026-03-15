import { NextFunction, Request, Response } from "express";
import { httpLog } from "../utils/logs";

export const httpLogger = (request: Request, response: Response, next: NextFunction) => {
  const start = Date.now()
  response.on("finish", () => {
    httpLog({
      method: request.method,
      url: request.originalUrl,
      status: response.statusCode,
      duration: `${Date.now() - start}ms`,
      ip: request.headers['x-forwarded-for'] || request.socket.remoteAddress,
      userAgent: request.headers['user-agent'],
      userId: request.user?.id || null,
    })
  })

  next()
}