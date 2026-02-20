import z from "zod";
import { LessonStatus } from "../../../generated/prisma/enums";


const lessonParams = z.object({
  courseId: z.string('Course ID is required').uuid('Invalid course ID'),
  lessonId: z.string('Lesson ID is required').uuid('Invalid lesson ID'),
});

const courseParams = z.object({
  courseId: z.string('Course ID is required').uuid('Invalid course ID'),
});


const lessonVideo = z.object({
  title: z
    .string()
    .min(2, 'Video title must be at least 2 characters')
    .max(150, 'Video title must not exceed 150 characters')
    .trim()
    .optional(),

  url: z
    .string('Video URL is required')
    .url('Invalid video URL'),
  // .refine(
  //   (url) => url.includes('cloudinary.com'),
  //   'Video must be hosted on Cloudinary',
  // ),
  order: z
    .number('Video order is required')
    .int('Order must be an integer')
    .min(1, 'Order must be at least 1'),

  duration: z
    .number()
    .int('Duration must be in whole seconds')
    .min(1, 'Duration must be at least 1 second')
    .optional()
});


const createLesson = z.object({
  params: courseParams,
  body: z
    .object({
      title: z
        .string('Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title must not exceed 150 characters')
        .trim(),

      order: z
        .number('Order is required')
        .int('Order must be an integer')
        .min(1, 'Order must be at least 1'),

      isPreview: z
        .boolean()
        .default(false),

      text: z
        .string()
        .min(10, 'Text content must be at least 10 characters')
        .max(50000, 'Text content must not exceed 50000 characters')
        .optional(),

      // Videos uploaded to cloudinary first
      // then send { url, duration } here
      videos: z
        .array(lessonVideo)
        .min(1, 'At least one video required if videos provided')
        .refine(
          (videos) => {
            const orders = videos.map((v) => v.order);
            return new Set(orders).size === orders.length;
          },
          { message: 'Video order values must be unique' },
        )
        .optional(),
    })

    // Must have text OR at least one video
    .refine(
      (data) => data.text || (data.videos && data.videos.length > 0),
      {
        message: 'Lesson must have text content or at least one video',
        path: ['text'],
      },
    ),
});


const updateLesson = z.object({
  params: lessonParams,

  body: z
    .object({
      title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title must not exceed 150 characters')
        .trim()
        .optional(),

      order: z
        .number()
        .int('Order must be an integer')
        .min(1, 'Order must be at least 1')
        .optional(),

      isPreview: z
        .boolean()
        .optional(),

      text: z
        .string()
        .min(10, 'Text content must be at least 10 characters')
        .max(50000, 'Text content must not exceed 50000 characters')
        .optional(),
    })

    // At least one field must be provided
    .refine(
      (data) => Object.keys(data).length > 0,
      { message: 'At least one field must be provided' },
    ),
});


const updateLessonStatus = z.object({
  params: lessonParams,

  body: z
    .object({
      status: z.enum(Object.keys(LessonStatus), 'Status is required'),

      // Required only when status is SCHEDULED
      scheduledAt: z
        .string()
        .datetime({ message: 'scheduledAt must be a valid ISO datetime' })
        .optional(),
    })

    // scheduledAt required when SCHEDULED
    .refine(
      (data) => {
        if (data.status === 'SCHEDULED' && !data.scheduledAt) return false;
        return true;
      },
      {
        message: 'scheduledAt is required when status is SCHEDULED',
        path: ['scheduledAt'],
      },
    )

    // scheduledAt must be future date
    .refine(
      (data) => {
        if (data.status === 'SCHEDULED' && data.scheduledAt) {
          return new Date(data.scheduledAt) > new Date();
        }
        return true;
      },
      {
        message: 'scheduledAt must be a future date and time',
        path: ['scheduledAt'],
      },
    )

    // scheduledAt not allowed when DRAFT or PUBLISHED
    .refine(
      (data) => {
        if (data.status !== 'SCHEDULED' && data.scheduledAt) return false;
        return true;
      },
      {
        message: 'scheduledAt is only allowed when status is SCHEDULED',
        path: ['scheduledAt'],
      },
    ),
});



const addLessonVideo = z.object({
  params: lessonParams,
  body: lessonVideo,
});


const updateLessonVideo = z.object({
  params: lessonParams.extend({
    videoId: z
      .string('Video ID is required')
      .uuid('Invalid video ID'),
  }),

  body: z
    .object({
      title: z
        .string()
        .min(2, 'Title must be at least 2 characters')
        .max(150, 'Title must not exceed 150 characters')
        .trim()
        .optional(),

      order: z
        .number()
        .int()
        .min(1, 'Order must be at least 1')
        .optional(),

      duration: z
        .number()
        .int()
        .min(1)
        .optional(),
    })

    .refine(
      (data) => Object.keys(data).length > 0,
      { message: 'At least one field must be provided' },
    ),
});

export const lessonValidation = {
  createLesson,
  updateLesson,
  updateLessonStatus,
  addLessonVideo,
  updateLessonVideo,
  lessonVideo
}

export type ICreateLesson = z.infer<typeof createLesson>['body'];
export type IUpdateLesson = z.infer<typeof updateLesson>['body'];
export type IUpdateLessonStatus = z.infer<typeof updateLessonStatus>['body'];
export type IAddLessonVideo = z.infer<typeof addLessonVideo>['body'];
export type IUpdateLessonVideo = z.infer<typeof updateLessonVideo>['body'];
export type ILessonVideo = z.infer<typeof lessonVideo>;