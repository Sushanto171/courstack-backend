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
  durationMinutes: z
    .number('Duration Minutes is required')
    .min(0, 'Duration Minutes cannot be negative')
    .max(99999, 'Duration Minutes must not exceed 99999')
    .default(0),
  status: z.enum(Object.keys(CourseStatus), "Status must be have 'DRAFT or PUBLISHED or ARCHIVED' ").default(CourseStatus.DRAFT).optional(),

  categoryId: z
    .string('Category is required')
    .uuid('Invalid category ID'),
});


const updateCourse = z.object({
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
  durationMinutes: z
    .number('Duration Minutes is required')
    .min(0, 'Duration Minutes cannot be negative')
    .max(99999, 'Duration Minutes must not exceed 99999')
    .default(0),
  categoryId: z
    .string('Category is required')
    .uuid('Invalid category ID'),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);

const updateCourseStatus = z.object({
  status: z.enum(
    Object.keys(CourseStatus),
    'Status is required'),
});



export type ICreateCourse = z.infer<typeof createCourse>;
export type IUpdateCourse = z.infer<typeof updateCourse>;
export type IUpdateCourseStatus = z.infer<typeof updateCourseStatus>;

export const courseValidation = {
  createCourse,
  updateCourse,
  updateCourseStatus
}