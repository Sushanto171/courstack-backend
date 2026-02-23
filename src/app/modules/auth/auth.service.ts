import config from "@/app/config";
import { sendEmail } from "@/app/config/nodemailer";
import { clearCache, getCache, setCache } from "@/app/helper/cache";
import { IAuthUser } from "@/app/types";
import { generateOTP } from "@/app/utils/generateOTP";
import { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../../helper/ApiError";
import { checkUserHealth } from "../../helper/checkUserHealth";
import httpStatus from "../../helper/httpStatusCode";
import { comparePasswords } from "../../utils/bcrypt";
import { decodedJWT, generateAccessAndRefreshToken } from "../../utils/jwt";
import { userRepository } from "../user/user.repository";
import { userService } from "../user/user.service";
import { IVerifyOtp, Login } from "./auth.validation";

const login = async (payload: Login) => {

  const isExist = await userRepository.findByEmail(payload.email, false)

  if (!isExist) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email or password");

  // verify status and deleted
  checkUserHealth(isExist)


  const matchPassword = await comparePasswords(payload.password, isExist.password)

  if (!matchPassword) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email or password");

  const { id, name, email, role } = isExist
  const userData = { id, name, email, role }

  const tokens = generateAccessAndRefreshToken(userData)

  return { userData, tokens }
};

const getMe = async (email: string) => {
  const data = await userService.verifyUser(email)
  return data
}

const refreshToken = async (refreshToken: string) => {
  const decoded = decodedJWT(refreshToken, config.jwt.JWT_REFRESH_SECRET) as JwtPayload
  const user = await userService.verifyUser(decoded.email)
  const { id, name, email, role } = user
  const userData = { id, name, email, role }

  return generateAccessAndRefreshToken(userData)
}

const getVerifyOtp = async (authUser: IAuthUser) => {
  const user = await userService.verifyUser(authUser.email);

  const otp = generateOTP();

  const cacheKey = `verify:${user.email}`

  const cached = await setCache(cacheKey, otp, 5);

  if (cached) {
    // send email
    await sendEmail({
      email: user.email,
      purpose: "Security",
      senderEmail: config.SYSTEM_SECURITY_EMAIL,
      subject: "Account Verify OTP",
      otp
    })
    return { redirectUrl: `${config.FRONTEND_URL}/verify?email=${user.email}` }
  }
  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Please try again.")
}

const verify = async (authUser: IAuthUser, payload: IVerifyOtp) => {

  const user = await userService.verifyUser(authUser.email);

  if (user.isVerified) throw new ApiError(httpStatus.BAD_REQUEST, "You are already verified!")

  const cacheKey = `verify:${user.email}`;

  const cached = await getCache(cacheKey);

  if (!cached) throw new ApiError(httpStatus.BAD_REQUEST, "Expired or Invalid OTP");

  const testOTP = "123456" //for development
  if (!testOTP || cached !== payload.otp) throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect OTP")
  await clearCache(cacheKey)

  return await userRepository.updateByEmail(user.email, { isVerified: true })
}

export const authService = {
  login,
  getMe,
  refreshToken,
  verify,
  getVerifyOtp
};
