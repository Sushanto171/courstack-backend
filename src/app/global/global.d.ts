import { IAuthUser } from "../types";


export { };

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser
    }
  }
}