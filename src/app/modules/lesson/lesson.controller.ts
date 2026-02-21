import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import { IAuthUser } from "../../types";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/SendResponse";
import { lessonService } from "./lesson.service";

const getLessonsByCourseId = catchAsync(async (req, res) => {

  const courseId = req.params?.courseId as string

  const data = await lessonService.getLessonsByCourseId(req.user as IAuthUser, courseId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses Lessons overview retrieved successfully",
    data
  })
})

const getOneLessonByLessonId = catchAsync(async (req, res) => {

  const { courseId, lessonId } = req.params as { courseId: string, lessonId: string }
  if (!(courseId && lessonId)) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid course or lessonId")

  const data = await lessonService.getOneLessonByLessonId(req.user as IAuthUser, courseId, lessonId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses Lessons overview retrieved successfully",
    data
  })
})

const create = catchAsync(async (req, res) => {

  const courseId = req.params?.courseId as string
  const data = await lessonService.create(req.user as IAuthUser, courseId, req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Lesson added successfully",
    data
  })
})

const updateByLessonId = catchAsync(async (req, res) => {

  const { courseId, lessonId } = req.params as { courseId: string, lessonId: string }

  if (!(courseId && lessonId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid course or lessonId")
  }

  const data = await lessonService.updateLessonByLessonId(req.user as IAuthUser, courseId, lessonId, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson updated successfully",
    data
  })
})

export const lessonController = { getLessonsByCourseId, getOneLessonByLessonId, create, updateByLessonId }