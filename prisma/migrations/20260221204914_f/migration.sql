/*
  Warnings:

  - The `lastAccessLessonOrder` column on the `enrollments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "lastAccessLessonOrder",
ADD COLUMN     "lastAccessLessonOrder" INTEGER;
