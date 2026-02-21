import { LessonStatus } from "../../../generated/prisma/enums"
import { ApiError } from "../../helper/ApiError"
import httpStatus from "../../helper/httpStatusCode"
import { IAuthUser } from "../../types"
import { courseRepository } from "../course/course.repository"
import { courseService } from "../course/course.service"
import { lessonRepository } from "./lesson.repository"
import { ICreateLesson, IUpdateLesson } from "./lesson.validation"

const verifyCourseOwnership = async (instructorId: string, courseId: string) => {
  const course = await courseRepository.getOneCourse({
    id: courseId,
    deletedAt: null,
  });

  if (!course) throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');


  if (course.instructorId !== instructorId) throw new ApiError(httpStatus.FORBIDDEN, 'You do not own this course');

  return course;
}

// anyone can view all (published) lessons (course overview) 
// owner can view own draft, schedule, published lessons
const getLessonsByCourseId = async (authUser: IAuthUser, courseId: string) => {
  const existingCourse = await courseService.verifyCourseExist(courseId);

  const isOwner = existingCourse.instructorId === authUser.id;

  return await lessonRepository.getLessonsByCourseId({
    courseId,
    status: isOwner ? undefined : LessonStatus.PUBLISHED,
  },
    {
      id: true,
      order: true,
      isPreview: true,
      title: true,
      lessonVideos: {
        select: {
          id: true,
          title: true,
          duration: true
        },
        orderBy: {
          order: "asc"
        }
      },
    },

  )
}

// only one lesson with all included parts 
// can access owner, super admin, admin without enrollment and 
//as student at first enrolled / isPreview = true no need enrolled
const getOneLessonByLessonId = async (authUser: IAuthUser, courseId: string, lessonId: string) => {
  const existingCourse = await courseService.verifyCourseExist(courseId);

  const isOwner = existingCourse.instructorId === authUser.id;

  return await lessonRepository.getLessonsByCourseId({
    courseId,
    status: isOwner ? undefined : LessonStatus.PUBLISHED,
    id: lessonId
  }, {
    id: true,
    order: true,
    isPreview: true,
    title: true,
    lessonVideos: {
      select: {
        url: true
      },
      orderBy: {
        order: "asc"
      }
    },
  },
  )
}

const create = async (authUser: IAuthUser, courseId: string, payload: ICreateLesson) => {

  await verifyCourseOwnership(authUser.id, courseId)

  return await lessonRepository.create(courseId, payload)
}


const updateLessonByLessonId = async (authUser: IAuthUser, courseId: string, lessonId: string, payload: IUpdateLesson) => {
  await verifyCourseOwnership(authUser.id, courseId);
  return await lessonRepository.updateById(lessonId, courseId, payload)
}

export const lessonService = { create, getLessonsByCourseId, getOneLessonByLessonId, updateLessonByLessonId, }