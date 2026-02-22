import { CourseStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";

const now = new Date();
const previous7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const previous30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

const userStats = async () => {

  const [
    totalUsers,
    usersByRole,
    usersLast7Days,
    usersLast30Days,
    usersLast7DaysSummery,

    last7DaysChart,
    last30DaysChart

  ] = await Promise.all([

    prisma.user.count(),

    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true }
    }),

    prisma.user.count({
      where: { createdAt: { gte: previous7Days } }
    }),

    prisma.user.count({
      where: { createdAt: { gte: previous30Days } }
    }),

    prisma.user.findMany({
      where: { createdAt: { gte: previous7Days } },
      select: { id: true, name: true, photoURL: true, isVerified: true },
      orderBy: { createdAt: "desc" },
      take: 10
    }),

    prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "users"
      WHERE "createdAt" >= ${previous7Days}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,


    prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "users"
      WHERE "createdAt" >= ${previous30Days}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `
  ]);

  return {
    totalUsers,
    usersLast7Days,
    usersLast30Days,

    usersByRole: usersByRole.map(r => ({
      label: r.role,
      value: r._count._all
    })),

    usersLast7DaysSummery,

    charts: {
      last7Days: last7DaysChart,
      last30Days: last30DaysChart,
      roles: usersByRole.map(r => ({
        label: r.role,
        value: r._count._all
      }))
    }
  };
};


const courseStats = async () => {

  const [
    totalCourses,
    coursesByCategory,
    statusByCourses,
    recentCourses,
    last30DaysChart,
    pendingReviewCourses
  ] = await Promise.all([

    prisma.course.count(),

    prisma.course.groupBy({
      by: ["categoryId"],
      _count: { _all: true }
    }),

    prisma.course.groupBy({ by: ["status"], _count: { _all: true } }),

    prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        thumbnail: true,
        status: true,
        createdAt: true,
        category: {
          select: { name: true }
        }
      }
    }),

    prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "courses"
      WHERE "createdAt" >= ${previous30Days}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,

    prisma.course.findMany({ where: { status: CourseStatus.PENDING_REVIEW }, select: { id: true, title: true, thumbnail: true } })
  ]);

  const categories = await prisma.category.findMany({
    select: { id: true, name: true }
  });

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  return {
    totalCourses,
    charts: {
      byStatus: statusByCourses.map(({ status, _count }) => ({ label: status, total: _count._all })),
      byCategory: coursesByCategory.map(c => ({
        label: categoryMap.get(c.categoryId) ?? "Unknown",
        value: c._count._all
      })),
      last30Days: last30DaysChart
    },
    recentCourses,
    pendingReviewCourses
  };
};


const enrollmentStats = async () => {

  const [
    totalEnrollments,
    enrollmentsByStatus,
    enrollmentsLast7Days,
    enrollmentsLast30Days,
    recentEnrollments,
    topCourses,
    last30DaysChart
  ] = await Promise.all([

    prisma.enrollment.count(),

    prisma.enrollment.groupBy({
      by: ["status"],
      _count: { _all: true }
    }),

    prisma.enrollment.count({
      where: { enrolledAt: { gte: previous7Days } }
    }),

    prisma.enrollment.count({
      where: { enrolledAt: { gte: previous30Days } }
    }),

    prisma.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      take: 10,
      select: {
        id: true,
        enrolledAt: true,
        status: true,
        student: {
          select: {
            id: true,
            name: true,
            photoURL: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true
          }
        }
      }
    }),

    prisma.enrollment.groupBy({
      by: ["courseId"],
      _count: { _all: true },
      orderBy: { _count: { courseId: "desc" } },
      take: 5
    }),

    prisma.$queryRaw`
      SELECT DATE("enrolledAt") as date, COUNT(*)::int as count
      FROM "enrollments"
      WHERE "enrolledAt" >= ${previous30Days}
      GROUP BY DATE("enrolledAt")
      ORDER BY date ASC
    `
  ]);

  const courses = await prisma.course.findMany({
    where: {
      id: { in: topCourses.map(c => c.courseId) }
    },
    select: { id: true, title: true }
  });

  const courseMap = new Map(courses.map(c => [c.id, c.title]));

  return {
    totalEnrollments,
    enrollmentsLast7Days,
    enrollmentsLast30Days,

    charts: {
      byStatus: enrollmentsByStatus.map(s => ({
        label: s.status,
        value: s._count._all
      })),

      last30Days: last30DaysChart,

      topCourses: topCourses.map(c => ({
        label: courseMap.get(c.courseId) ?? "Unknown",
        value: c._count._all
      }))
    },

    recentEnrollments
  };
};




export const statsRepository = { userStats, courseStats ,enrollmentStats};