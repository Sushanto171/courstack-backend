import httpStatus from "../../helper/httpStatusCode"
import { IAuthUser } from "../../types"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/SendResponse"
import { statsService } from "./stats.service"

const getStats = catchAsync(async (req, res) => {

  const data = await statsService.getStats(req.user as IAuthUser)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stats retrieved successfully",
    data
  })
})


export const statsController = { getStats }