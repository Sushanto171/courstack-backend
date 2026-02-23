import cron from 'node-cron';
import { LessonStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../config/prisma';

const publishScheduledLesson = async () => {
  const now = new Date();
  const windowAhead = new Date(now.getTime() + 60 * 1000);

  return prisma.lesson.updateMany({
    where: {
      status: LessonStatus.SCHEDULED,
      scheduledAt: { lte: windowAhead },
      publishedAt: null
    },
    data: {
      status: LessonStatus.PUBLISHED,
      publishedAt: now,
    },
  });
};
export const cronJob = async () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const res = await publishScheduledLesson();

      console.log('⏰ cron executed at:', now);
      console.log('📢 updated lessons:', res.count);

    } catch (error) {
      console.error('cron failed:', error);
    }
  });
};