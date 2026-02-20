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

const create = catchAsync(async (req, res) => {

  const data = await courseService.create(req.user as IAuthUser, req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data
  })
})


export const courseController = { getAll, getBySlug, create }