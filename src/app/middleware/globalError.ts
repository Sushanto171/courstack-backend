/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/SendResponse";

export const globalError = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const err = error
  const statusCode = 500

  sendResponse(res, {
    statusCode,
    success: false,
    message: "Something want wrong!",
    data: err,
  })
}