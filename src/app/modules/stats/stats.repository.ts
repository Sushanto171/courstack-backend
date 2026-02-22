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













export const statsRepository = { userStats };