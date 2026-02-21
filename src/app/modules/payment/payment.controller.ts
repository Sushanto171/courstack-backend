import httpStatus from "../../helper/httpStatusCode"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/SendResponse"
import { paymentService } from "./payment.service"

const paymentIpn = catchAsync(async (req, res) => {

  const data = await paymentService.validatePayment(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data
  })
})


export const paymentController = { paymentIpn }