import { ApiError } from "../../helper/ApiError"
import httpStatus from "../../helper/httpStatusCode"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/SendResponse"
import { categoryService } from "./category.service"

const getAll = catchAsync(async (req, res) => {

  const data = await categoryService.getAll()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data
  })
})

const getBySlug = catchAsync(async (req, res) => {

  const slug = req.params.slug as string;
  if (!slug) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid slug");

  const data = await categoryService.getBySlug(slug)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully",
    data
  })
})

const create = catchAsync(async (req, res) => {

  const data = await categoryService.create(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data
  })
})

const update = catchAsync(async (req, res) => {

  const id = req.params.id as string;
  if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid  category id");

  const data = await categoryService.update(id, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data
  })
})

export const categoryController = { create, getAll, getBySlug, update }