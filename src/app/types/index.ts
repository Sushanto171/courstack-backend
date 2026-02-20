import { Role, UserStatus } from "../../generated/prisma/enums";

export interface IAuthUser {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  deletedAt: Date | null;
  permissions?: string[];
}