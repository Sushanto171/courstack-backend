/*
  Warnings:

  - You are about to drop the column `lastAccessLessonId` on the `enrollments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "totalLessons" INTEGER;

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "lastAccessLessonId",
ADD COLUMN     "lastAccessLessonOrder" TEXT;
