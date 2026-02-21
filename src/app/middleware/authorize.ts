
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helper/ApiError";
import httpStatus from "../helper/httpStatusCode";

export const authorize = (...permissions: string[]) => (req: Request, res: Response, next: NextFunction) => {

  if (!req.user?.permissions) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");

  const userPerms = req.user.permissions; // ['course:create', ...]

  const hasAll = permissions.every(p => userPerms.includes(p));

  if (!hasAll) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  next();
};