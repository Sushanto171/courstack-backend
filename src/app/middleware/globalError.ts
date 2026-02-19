/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import httpStatus from "../helper/httpStatusCode";
import sendResponse from "../utils/SendResponse";

export const globalError = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something want wrong!"



  if (error instanceof ZodError) {
    message = "Validation failed"
    statusCode = httpStatus.BAD_REQUEST
    error = error.issues.map(e => ({
      path: e.path.join("."),
      message: e.message,
    }))
  }

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    data: null,
    error
  })
}