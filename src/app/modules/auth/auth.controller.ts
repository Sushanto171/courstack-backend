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


export const authController = {
  login
}