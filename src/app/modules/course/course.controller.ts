import httpStatus from "../../helper/httpStatusCode"
import { IAuthUser } from "../../types"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/SendResponse"
import { courseService } from "./course.service"

const create = catchAsync(async (req, res) => {

  const data = await courseService.create(req.user as IAuthUser, req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data
  })
})


export const courseController = { create }