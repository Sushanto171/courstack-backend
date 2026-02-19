import jwt, { SignOptions } from "jsonwebtoken"
import config from "../config"

export const generateToken = (payload: string | Buffer | object, secret: jwt.Secret, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn, algorithm: "HS256" } as SignOptions)
}


export const generateAccessAndRefreshToken = (payload: string | Buffer | object) => {

  const accessToken = generateToken(payload, config.jwt.JWT_ACCESS_SECRET, config.jwt.JWT_ACCESS_EXPIRE_IN);

  const refreshToken = generateToken(payload, config.jwt.JWT_REFRESH_SECRET, config.jwt.JWT_ACCESS_EXPIRE_IN);

  return { accessToken, refreshToken }
}


export const decodedJWT = (token: string, secret: jwt.Secret) => {
 const decoded = jwt.verify(token, secret)
 return decoded
}
