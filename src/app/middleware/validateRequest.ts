import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodSchema } from "zod";

const validateRequest = (schema: ZodSchema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
