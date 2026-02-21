import z from "zod";

export const enrollSchema = z.object({
  courseId: z
    .string('Course ID is required')
    .uuid('Invalid course ID'),
});


export const enrollmentValidation = { enrollSchema };

export type IEnroll = z.infer<typeof enrollSchema>