/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAuthUser } from "../types";


export { };

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser
      parsedQuery?: any
    }
  }
}