/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import config from "../config";
import { ApiError } from "../helper/ApiError";
import { checkUserHealth } from "../helper/checkUserHealth";
import httpStatus from "../helper/httpStatusCode";
import { userService } from "../modules/user/user.service";
import { decodedJWT } from "../utils/jwt";


const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies
  try {
    
    const decoded = decodedJWT(token.accessToken, config.jwt.JWT_ACCESS_SECRET) as JwtPayload

    req.user = await userService.getUserWithPermissions(decoded.email as string)

    // verify status and deleted
    checkUserHealth(req.user)

    next()
  } catch (error: any) {

    if (error.name === 'TokenExpiredError') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
    next(error)
  }

}

export default authenticate