import httpStatus from "../../helper/httpStatusCode";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/SendResponse";
import { userService } from "./user.service";

const getUsersFromDB = catchAsync(async (req, res) => {

  const data = await userService.getUsersFromDB()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data
  })
})


const createUser = catchAsync(async (req, res) => {

  const data = await userService.createUser(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data
  })
})

export const userController = {
  getUsersFromDB,
  createUser
}