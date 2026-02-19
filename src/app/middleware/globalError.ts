/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

export const globalError = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const err = error
  const statusCode = 500

  res.status(statusCode).json(err)
}