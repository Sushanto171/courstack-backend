import { Prisma } from "../../../generated/prisma/client";
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


const paymentStats = async () => {

  const [
    totalRevenueAgg,
    paymentsByStatus,
    revenueLast7DaysAgg,
    revenueLast30DaysAgg,
    recentPayments,
    topEnrollments,
    revenueChart
  ] = await Promise.all([

    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { price: true }
    }),

    prisma.payment.groupBy({
      by: ["status"],
      _count: { _all: true }
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: { gte: previous7Days }
      },
      _sum: { price: true }
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: { gte: previous30Days }
      },
      _sum: { price: true }
    }),

    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        price: true,
        status: true,
        createdAt: true,
        enrollment: {
          select: {
            student: {
              select: { id: true, name: true, photoURL: true }
            },
            course: {
              select: { id: true, title: true, thumbnail: true }
            }
          }
        }
      }
    }),

    // group by enrollment → later resolve course
    prisma.payment.groupBy({
      by: ["enrollmentId"],
      where: { status: "SUCCESS" },
      _sum: { price: true },
      orderBy: { _sum: { price: "desc" } },
      take: 5
    }),

    prisma.$queryRaw`
      SELECT DATE("createdAt") as date,
             SUM("price")::float as revenue
      FROM "payments"
      WHERE "status" = 'SUCCESS'
        AND "createdAt" >= ${previous30Days}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `
  ]);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      id: { in: topEnrollments.map(e => e.enrollmentId) }
    },
    select: {
      id: true,
      course: {
        select: { id: true, title: true }
      }
    }
  });

  const enrollmentToCourseMap = new Map(
    enrollments.map(e => [e.id, e.course.title])
  );

  return {
    totalRevenue: totalRevenueAgg._sum.price ?? 0,
    revenueLast7Days: revenueLast7DaysAgg._sum.price ?? 0,
    revenueLast30Days: revenueLast30DaysAgg._sum.price ?? 0,

    charts: {

      byStatus: paymentsByStatus.map(s => ({
        label: s.status,
        value: s._count._all
      })),

      revenueLast30Days: revenueChart,

      topCourses: topEnrollments.map(e => ({
        label: enrollmentToCourseMap.get(e.enrollmentId) ?? "Unknown",
        value: e._sum.price ?? 0
      }))
    },

    recentPayments
  };
};




const instructorDashboardStats = async (instructorId: string) => {

  const courses = await prisma.course.findMany({
    where: { instructorId },
    select: { id: true, title: true }
  });

  const courseIds = courses.map(c => c.id);

  if (!courseIds.length) {
    return {
      totalCourses: 0,
      totalStudents: 0,
      totalEnrollments: 0,
      totalRevenue: 0,
      charts: { revenueLast30Days: [], topCourses: [] },
      recentEnrollments: []
    };
  }

  const [
    totalEnrollments,
    totalStudentsDistinct,
    totalRevenueAgg,
    recentEnrollments,
    revenueChart,
    topCoursesRevenue
  ] = await Promise.all([

    prisma.enrollment.count({
      where: { courseId: { in: courseIds } }
    }),

    prisma.enrollment.groupBy({
      by: ["studentId"],
      where: { courseId: { in: courseIds } },
      _count: { _all: true }
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        enrollment: {
          courseId: { in: courseIds }
        }
      },
      _sum: { price: true }
    }),

    prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      orderBy: { enrolledAt: "desc" },
      take: 10,
      select: {
        id: true,
        enrolledAt: true,
        student: {
          select: { id: true, name: true, photoURL: true }
        },
        course: {
          select: { id: true, title: true, thumbnail: true }
        }
      }
    }),

    prisma.$queryRaw`
      SELECT DATE(p."createdAt") as date,
             SUM(p."price")::float as revenue
      FROM "payments" p
      JOIN "enrollments" e ON e.id = p."enrollmentId"
      WHERE p."status"='SUCCESS'
        AND e."courseId" IN (${Prisma.join(courseIds)})
        AND p."createdAt" >= ${previous30Days}
      GROUP BY DATE(p."createdAt")
      ORDER BY date ASC
    `,

    prisma.payment.groupBy({
      by: ["enrollmentId"],
      where: {
        status: "SUCCESS",
        enrollment: { courseId: { in: courseIds } }
      },
      _sum: { price: true },
      orderBy: { _sum: { price: "desc" } },
      take: 5
    })
  ]);

  const enrollmentIds = topCoursesRevenue.map(e => e.enrollmentId);

  const enrollments = await prisma.enrollment.findMany({
    where: { id: { in: enrollmentIds } },
    select: {
      id: true,
      course: { select: { title: true } }
    }
  });

  const enrollmentCourseMap = new Map(
    enrollments.map(e => [e.id, e.course.title])
  );

  return {

    totalCourses: courseIds.length,
    totalEnrollments,
    totalStudents: totalStudentsDistinct.length,
    totalRevenue: totalRevenueAgg._sum.price ?? 0,

    charts: {

      revenueLast30Days: revenueChart,

      topCourses: topCoursesRevenue.map(e => ({
        label: enrollmentCourseMap.get(e.enrollmentId) ?? "Unknown",
        value: e._sum.price ?? 0
      }))
    },

    recentEnrollments
  };
};


const studentDashboardStats = async (studentId: string) => {

  const payments = await prisma.payment.findMany({
    where: {
      enrollment: { studentId }
    },
    select: {
      id: true, price: true, status: true, transactionId: true,
      enrollment: { select: { course: { select: { id: true, title: true, thumbnail: true } } } },
      createdAt: true,
    }
  })

  return payments.map(p => ({
    id: p.id,
    transactionId: p.transactionId,
    amount: Number(p.price),
    status: p.status,
    course: {
      id: p.enrollment.course.id,
      title: p.enrollment.course.title,
      thumbnail: p.enrollment.course.thumbnail
    },
    date: p.createdAt
  }));

}

export const statsRepository = { userStats, courseStats, enrollmentStats, paymentStats, instructorDashboardStats, studentDashboardStats };