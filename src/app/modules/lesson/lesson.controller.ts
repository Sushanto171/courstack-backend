import httpStatus from "../../helper/httpStatusCode";
import { IAuthUser } from "../../types";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/SendResponse";
import { lessonService } from "./lesson.service";

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

export const lessonController = { create }