import { ApiError } from "../../helper/ApiError"
import httpStatus from "../../helper/httpStatusCode"
import { IAuthUser } from "../../types"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/SendResponse"
import { courseService } from "./course.service"

const getAll = catchAsync(async (req, res) => {

  const data = await courseService.getAll()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses retrieved successfully",
    data
  })
})

const getBySlug = catchAsync(async (req, res) => {

  const slug = req.params.slug as string

  if (!slug) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid slug")

  const data = await courseService.getBySlug(slug)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: data ? "Course retrieved successfully" : "Course not found!",
    data
  })
})

const getMyCourses = catchAsync(async (req, res) => {

  const data = await courseService.getMyCourses(req.user as IAuthUser)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: data.length ? "Course retrieved successfully" : "Course not found!",
    data
  })
})

const create = catchAsync(async (req, res) => {

  const thumbnail = req?.file?.path;

  const data = await courseService.create(req.user as IAuthUser, { ...req.body, thumbnail })

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data
  })
})

const update = catchAsync(async (req, res) => {

  const thumbnail = req?.file?.path;

  const id = req.params.id as string

  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid course id.")

  const data = await courseService.update(req.user as IAuthUser, id, { ...req.body, thumbnail })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data
  })
})


const softDelete = catchAsync(async (req, res) => {

  const id = req.params.id as string

  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid course id.")

  await courseService.softDelete(req.user as IAuthUser, id,)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course Deleted successfully",
    data: null
  })
})


export const courseController = { getAll, getBySlug, create, update, getMyCourses, softDelete }