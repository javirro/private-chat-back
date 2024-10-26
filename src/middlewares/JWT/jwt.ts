const jwt = require('jsonwebtoken')

export interface VerifyJWTRes {
  wallet: string
  userid: number
  admin: boolean
  iat: number
  exp: number
}

export const generateJWTAccessToken = (wallet: string, userid: number, admin: boolean, is30days: boolean = false): string => {
  const validTime: string = is30days ? '30d' : '1d'
  const jwtToken: string = jwt.sign({ wallet, userid, admin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: validTime })
  return jwtToken
}

export const verifyJWTToken = (token: string): VerifyJWTRes => {
  const res: VerifyJWTRes = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  return res
}
