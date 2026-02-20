import { ApiError } from "../../helper/ApiError"
import httpStatus from "../../helper/httpStatusCode"
import { IAuthUser } from "../../types"
import { courseRepository } from "../course/course.repository"
import { lessonRepository } from "./lesson.repository"
import { ICreateLesson } from "./lesson.validation"

const verifyCourseOwnership = async (instructorId: string, courseId: string) => {
  const course = await courseRepository.getOneCourse({
    id: courseId,
    deletedAt: null,
  });

  if (!course) throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');


  if (course.instructorId !== instructorId) throw new ApiError(httpStatus.FORBIDDEN, 'You do not own this course');

  return course;
}

const create = async (authUser: IAuthUser, courseId: string, payload: ICreateLesson) => {

  await verifyCourseOwnership(authUser.id, courseId)

  return await lessonRepository.create(courseId, payload)
}


export const lessonService = { create }