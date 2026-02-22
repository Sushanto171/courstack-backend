import { Role } from "../../../generated/prisma/enums";
import { IAuthUser } from "../../types";
import { enrollService } from "../enrollment/enrollment.service";
import { statsRepository } from "./stats.repository";

const getStats = async (authUser: IAuthUser) => {

  const role = authUser.role;

  if (role === Role.SUPER_ADMIN || role === Role.ADMIN) {

    const [
      usersStats,
      courseStats,
      enrollmentStats,
      paymentStats
    ] = await Promise.all([
      statsRepository.userStats(),
      statsRepository.courseStats(),
      statsRepository.enrollmentStats(),
      statsRepository.paymentStats()
    ]);

    return {
      usersStats,
      courseStats,
      enrollmentStats,
      paymentStats
    };
  }

  if (role === Role.INSTRUCTOR) {

    const instructorDashboardStats =
      await statsRepository.instructorDashboardStats(authUser.id);

    return { instructorDashboardStats };
  }

  if (role === Role.STUDENT) {

    const [studentPayments, studentEnrollments] = await Promise.all([
      statsRepository.studentDashboardStats(authUser.id),
      enrollService.getEnrolledByStudentId(authUser)
    ]);

    return {
      studentDashboardStats: {
        payments: studentPayments,
        enrollments: studentEnrollments.data,
        totalEnrollments: studentEnrollments.meta.totalEnrollments
      }
    };
  }

  return {};
};

export const statsService = { getStats };