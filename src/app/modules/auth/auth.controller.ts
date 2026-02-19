import httpStatus from "../../helper/httpStatusCode";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/SendResponse";
import { authService } from "./auth.service";

const login = catchAsync(async (req, res) => {

  const data = await authService.login(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully",
    data
  })
})


export const authController = {
  login
}