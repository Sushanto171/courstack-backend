import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import { IAuthUser } from "../../types";
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

const refreshToken = catchAsync(async (req, res) => {
  const token = req?.cookies?.refreshToken;

  if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, "User no longer exists");

  const tokens = await authService.refreshToken(token);

  setCookie(res, tokens)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "set new token successfully.",
    data: null
  })
})


const getVerifyOtp = catchAsync(async (req, res) => {

  const { redirectUrl } = await authService.getVerifyOtp(req.user as IAuthUser)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Please check your email.",
    data: redirectUrl
  })

  // return res.redirect(httpStatus.TEMPORARY_REDIRECT, redirectUrl);

})


const verify = catchAsync(async (req, res) => {

  const data = await authService.verify(req.user as IAuthUser, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account verified successfully.",
    data
  })

})



export const authController = {
  login,
  getMe,
  refreshToken,
  getVerifyOtp,
  verify
}