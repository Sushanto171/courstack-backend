import { z } from 'zod';
import { CourseStatus } from '../../../generated/prisma/enums';
import { buildQuerySchema } from '../../schema/query';

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

const courseFilters = z.object({
  instructorId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),

  status: z.preprocess(
    (val) => {
      if (typeof val === "string") return val.split(",");
      return val;
    },
    z.array(z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "PENDING_REVIEW"])).optional()
  ),

  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),

  minDuration: z.coerce.number().int().min(0).optional(),
  maxDuration: z.coerce.number().int().min(0).optional(),

  includeDeleted: z.coerce.boolean().default(false),
});


const courseQuerySchema = buildQuerySchema({
  sortFields: ["createdAt", "updatedAt", "price", "title", "durationMinutes"] as const,
  defaultSort: "createdAt",
  defaultOrder: "desc",
  filters: courseFilters
})


export type ICreateCourse = z.infer<typeof createCourse>;
export type IUpdateCourse = z.infer<typeof updateCourse>;
export type IUpdateCourseStatus = z.infer<typeof updateCourseStatus>;
export type ICourseQuery = z.infer<typeof courseQuerySchema>;

export const courseValidation = {
  createCourse,
  updateCourse,
  updateCourseStatus,
  courseQuerySchema
}