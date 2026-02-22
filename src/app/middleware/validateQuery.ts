import { RequestHandler } from "express";
import z, { ZodTypeAny } from "zod";

export const validateQuery = <T extends ZodTypeAny>(
  schema: T
): RequestHandler => {
  return (req, _res, next) => {
    try {
      req.parsedQuery = schema.parse(req.query) as z.infer<T>;
      next();
    } catch (err) {
      next(err);
    }
  };
};