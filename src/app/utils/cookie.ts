import { CookieOptions, Response } from "express";
import config from "../config";
import { maxAgeConvertor } from "../helper/maxAgeConverter";

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

const cookieOption: CookieOptions = {
  secure: true,
  sameSite: "none",
  httpOnly: true
}

export const setCookie = (res: Response, tokens: ITokens) => {

  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken,
      { ...cookieOption, maxAge: maxAgeConvertor(config.jwt.JWT_ACCESS_EXPIRE_IN), })
  }
  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken,
      { ...cookieOption, maxAge: maxAgeConvertor(config.jwt.JWT_REFRESH_EXPIRE_IN), })
  }

}