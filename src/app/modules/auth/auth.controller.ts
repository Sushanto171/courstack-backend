import httpStatus from "../../helper/httpStatusCode";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/SendResponse";

const getUsersFromDB = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: {
      name: "John Doe",
      email: "john.doe@example.com"
    }
  })
})


export const authController = {
  getUsersFromDB
}