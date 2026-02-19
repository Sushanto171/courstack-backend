import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import catchAsync from "../../utils/catchAsync";
import { setCookie } from "../../utils/cookie";
import sendResponse from "../../utils/SendResponse";
import { authService } from "./auth.service";

const login = catchAsync(async (req, res) => {

  const { userData: data, tokens } = await authService.login(req.body)

  setCookie(res, tokens)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully",
    data
  })
})

const getMe = catchAsync(async (req, res) => {

  if (!req.user?.email) throw new ApiError(httpStatus.UNAUTHORIZED, "User no longer exists");

  const data = await authService.getMe(req.user.email)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile info retrieved successfully.",
    data
  })
})




export const authController = {
  login,
  getMe
}