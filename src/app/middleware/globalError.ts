/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import httpStatus from "../helper/httpStatusCode";
import sendResponse from "../utils/SendResponse";

export const globalError = (error: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error?.message || "Something want wrong!"

  // prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      message = "Duplicate key error";
      error = error.meta;
      statusCode = httpStatus.CONFLICT;
    }
    if (error.code === "P1000") {
      message = " Authentication failed against database server";
      error = error.meta;
      statusCode = httpStatus.BAD_GATEWAY;
    }
    if (error.code === "P2003") {
      message = "Foreign key constraint failed on the field";
      error = error.meta;
      statusCode = httpStatus.BAD_REQUEST;
    }
    if (error.code === "P2025") {
      message = "No record was found for a query.";
      error = error.meta;
      statusCode = httpStatus.BAD_REQUEST;
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = error.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Unknown Prisma error occurred";
    error = error.message;
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    message = "Prisma client failed to initialize";
    error = error.message;
  }


  if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST
    error = error.issues.map(e => ({
      path: e.path.join("."),
      message: e.message,
    }))
    message = "Validation failed";
  }

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    data: null,
    error
  })
}