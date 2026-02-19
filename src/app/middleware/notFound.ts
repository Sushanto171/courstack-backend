import { NextFunction, Request, Response } from "express"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  const path = req.path
  res.status(404).send(`🤭 Oops! Not Found : ${path} this path.`)
}