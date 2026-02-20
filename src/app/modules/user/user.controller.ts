/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "../../helper/httpStatusCode";
import { IAuthUser } from "../../types";
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

const updateUser = catchAsync(async (req, res) => {
  const id = req.params.id as string
  // change profile photo
  const photoURL = req?.file?.path;
  const data = await userService.updateUser(req.user as IAuthUser, id, { ...req.body, photoURL })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User info updated successfully",
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
  updateStatus,
  updateUser
}