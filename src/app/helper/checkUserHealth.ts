import { User } from "../../generated/prisma/client";
import { UserStatus } from "../../generated/prisma/enums";
import { ApiError } from "./ApiError";

export const checkUserHealth = (user: Partial<User>) => {
  if (user.status !== UserStatus.ACTIVE) {
    throw new ApiError(403, `Account is temporary ${user.status}`);
  }

  if (user.deletedAt) {
    throw new ApiError(403, `Account is deleted!`);
  }
}