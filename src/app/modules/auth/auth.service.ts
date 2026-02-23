import config from "@/app/config";
import { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../../helper/ApiError";
import { checkUserHealth } from "../../helper/checkUserHealth";
import httpStatus from "../../helper/httpStatusCode";
import { comparePasswords } from "../../utils/bcrypt";
import { decodedJWT, generateAccessAndRefreshToken } from "../../utils/jwt";
import { userRepository } from "../user/user.repository";
import { Login } from "./auth.validation";

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
  const data = await userRepository.findByEmail(email)
  return data
}

const refreshToken = async (refreshToken: string) => {
  const decoded = decodedJWT(refreshToken, config.jwt.JWT_REFRESH_SECRET) as JwtPayload
  const user = await userRepository.findByEmail(decoded.email);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  const { id, name, email, role } = user
  const userData = { id, name, email, role }

  return generateAccessAndRefreshToken(userData)
}

export const authService = {
  login,
  getMe,
  refreshToken
};
