import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodSchema } from "zod";

const validateRequest = (schema: ZodSchema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {

    const data = req.body?.data ? JSON.parse(req.body?.data) : req.body;

    try {
      req.body = await schema.parse(data);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
