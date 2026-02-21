import { LessonStatus, Role } from "../../../generated/prisma/enums"
import { ApiError } from "../../helper/ApiError"
import httpStatus from "../../helper/httpStatusCode"
import { IAuthUser } from "../../types"
import { courseRepository } from "../course/course.repository"
import { courseService } from "../course/course.service"
import { enrollService } from "../enrollment/enrollment.service"
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
      courseId: true,
      status: true,
      lessonVideos: {
        select: {
          id: true,
          title: true,
          duration: true,
          order: true
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
  const canAccessWithoutEnrollment = authUser.role === Role.SUPER_ADMIN || authUser.role === Role.ADMIN;


  const lesson = await lessonRepository.getLessonsByCourseId({
    courseId,
    status: isOwner ? undefined : LessonStatus.PUBLISHED,
    id: lessonId
  }, {
    id: true,
    order: true,
    isPreview: true,
    title: true,
    courseId: true,
    status: true,
    lessonVideos: {
      omit: {
        lessonId: true,
      },
      orderBy: {
        order: "asc"
      }
    },
  },
  )
  if (!lesson) throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found");

  if (isOwner || canAccessWithoutEnrollment) return lesson;

  if (lesson.isPreview) return lesson;


  await enrollService.verifyEnrolled(courseId, authUser.id);

  return lesson;

}

const create = async (authUser: IAuthUser, courseId: string, payload: ICreateLesson) => {

  await verifyCourseOwnership(authUser.id, courseId)

  return await lessonRepository.create(courseId, payload)
}


const updateLessonByLessonId = async (authUser: IAuthUser, courseId: string, lessonId: string, payload: IUpdateLesson) => {

  await verifyCourseOwnership(authUser.id, courseId);
  return await lessonRepository.updateById(lessonId, courseId, payload)
}

const updateLessonStatusByLessonId = async (authUser: IAuthUser, courseId: string, lessonId: string, payload: { status: LessonStatus }) => {

  await verifyCourseOwnership(authUser.id, courseId);
  return await lessonRepository.updateById(lessonId, courseId, { status: payload.status })
}

const deleteLessonByLessonId = async (authUser: IAuthUser, courseId: string, lessonId: string) => {

  await verifyCourseOwnership(authUser.id, courseId);
  return await lessonRepository.deleteOne(lessonId, courseId,)
}



export const lessonService = { create, getLessonsByCourseId, getOneLessonByLessonId, updateLessonByLessonId, updateLessonStatusByLessonId, deleteLessonByLessonId }