import { Role, UserStatus } from "../../generated/prisma/enums";


export { };

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string,
        email: string,
        role: Role,
        status: UserStatus,
        deletedAt: Date | null,
        permissions?: string[]
      };
    }
  }
}