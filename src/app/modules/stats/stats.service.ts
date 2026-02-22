import { Role } from "../../../generated/prisma/enums";
import { IAuthUser } from "../../types";
import { statsRepository } from "./stats.repository";























const getRole = (authUser: IAuthUser) => {
  switch (authUser.role) {
    case Role.SUPER_ADMIN:
      return Role.SUPER_ADMIN;
    case Role.ADMIN:
      return Role.ADMIN;
    case Role.INSTRUCTOR:
      return Role.INSTRUCTOR;
    default:
      return Role.STUDENT
  }
}


const getStats = async (authUser) => {
  // const currentUserRole = getRole(authUser)

  const [ usersStats, courseStats ,enrollmentStats] = await Promise.all([

    statsRepository.userStats(),

    statsRepository.courseStats(),
    
    statsRepository.enrollmentStats()
  ])


  return { usersStats, courseStats,enrollmentStats }
}

export const statsService = { getStats }