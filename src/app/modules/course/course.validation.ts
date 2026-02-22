import { z } from 'zod';
import { CourseStatus } from '../../../generated/prisma/enums';

const createCourse = z.object({
  title: z
    .string('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(150, 'Title must not exceed 150 characters')
    .trim(),
  overview: z
    .string('Overview is required')
    .min(10, 'Overview must be at least 10 characters')
    .max(300, 'Overview must not exceed 150 characters')
    .trim(),
  description: z
    .string('Description is required')
    .min(5, 'Description must be at least 5 characters')
    .trim().optional(),
  price: z
    .number('Price is required')
    .min(0, 'Price cannot be negative')
    .max(99999, 'Price must not exceed 99999')
    .default(0),
  totalLessons: z
    .number('TotalLessons is required')
    .min(0, 'TotalLessons cannot be negative')
    .max(99999, 'TotalLessons must not exceed 99999'),
  durationMinutes: z
    .number('Duration Minutes is required')
    .min(0, 'Duration Minutes cannot be negative')
    .max(99999, 'Duration Minutes must not exceed 99999')
    .default(0),
  status: z.enum([CourseStatus.DRAFT, CourseStatus.PENDING_REVIEW], "Invalid course status. Allowed values: DRAFT, PUBLISHED").optional(),

  categoryId: z
    .string('Category is required')
    .uuid('Invalid category ID'),
});


const updateCourse = z.object({
  title: z
    .string('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(150, 'Title must not exceed 150 characters')
    .trim().optional(),
  overview: z
    .string('Overview is required')
    .min(10, 'Overview must be at least 10 characters')
    .max(300, 'Overview must not exceed 150 characters')
    .trim().optional(),
  description: z
    .string('Description is required')
    .min(5, 'Description must be at least 5 characters')
    .trim().optional(),
  price: z
    .number('Price is required')
    .min(0, 'Price cannot be negative')
    .max(99999, 'Price must not exceed 99999')
    .optional(),
  totalLessons: z
    .number('Total Lessons is required')
    .min(0, 'Total Lessons cannot be negative')
    .max(99999, 'Total Lessons must not exceed 99999').optional(),
  durationMinutes: z
    .number('Duration Minutes is required')
    .min(0, 'Duration Minutes cannot be negative')
    .max(99999, 'Duration Minutes must not exceed 99999')
    .optional(),
  categoryId: z
    .string('Category is required')
    .uuid('Invalid category ID'),
  status: z.enum([CourseStatus.DRAFT, CourseStatus.PENDING_REVIEW], "Invalid course status. Allowed values: DRAFT, PENDING_REVIEW").optional(),
});

const updateCourseStatus = z.object({
  status: z.enum(
    Object.keys(CourseStatus),
    'Invalid course status. Allowed values: DRAFT, PUBLISHED, ARCHIVED, PENDING_REVIEW'),
});



export type ICreateCourse = z.infer<typeof createCourse>;
export type IUpdateCourse = z.infer<typeof updateCourse>;
export type IUpdateCourseStatus = z.infer<typeof updateCourseStatus>;

export const courseValidation = {
  createCourse,
  updateCourse,
  updateCourseStatus
}