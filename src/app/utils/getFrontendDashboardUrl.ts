import { Role } from "@/generated/prisma/enums";
import config from "../config";

export const getFrontendDashboardUrl = (role: Role) => {
  const frontendUrl = config.FRONTEND_URL
  switch (role) {
    case "STUDENT":
      return `${frontendUrl}/dashboard`
    case "INSTRUCTOR":
      return `${frontendUrl}/instructor/dashboard`
    case "ADMIN":
      return `${frontendUrl}/admin/dashboard`
    case "SUPER_ADMIN":
      return `${frontendUrl}/super-admin/dashboard`
    default: return `${frontendUrl}/dashboard`
  }
}