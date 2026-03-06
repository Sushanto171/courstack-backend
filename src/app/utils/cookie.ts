import { CookieOptions, Response } from "express";

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
      { ...cookieOption, maxAge: 60 * 1000 * 60 * 24 })
  }
  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken,
      { ...cookieOption, maxAge: 60 * 1000 * 60 * 24 * 5 })
  }

}