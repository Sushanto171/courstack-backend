import httpStatus from "../../helper/httpStatusCode";
import { IAuthUser } from "../../types";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/SendResponse";
import { enrollService } from "./enrollment.service";

const create = catchAsync(async (req, res) => {

  const data = await enrollService.create(req.user as IAuthUser, req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Enrollment success",
    data
  })
})

export const enrollController = { create }