/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "../../helper/httpStatusCode";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/SendResponse";
import { userService } from "./user.service";

const getUsersFromDB = catchAsync(async (req, res) => {

  const data = await userService.getUsersFromDB(req!.user!.role as Role)

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

// For super_admin access only
const createAdmin = catchAsync(async (req, res) => {

  const data = await userService.createAdmin(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully",
    data
  })
})

// For super_admin and admin access only
const updateStatus = catchAsync(async (req, res) => {

  const data = await userService.updateStatus(req!.user!.role, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data
  })
})

export const userController = {
  getUsersFromDB,
  createUser,
  createAdmin,
  updateStatus
}