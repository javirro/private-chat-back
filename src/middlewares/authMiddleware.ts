import { Request, Response, NextFunction } from 'express'
import { verifyJWTToken } from './JWT/jwt'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']
  if (!token) {
    console.error(`Error in authMiddleware. Token not found.`)
    res.status(401).json(false)
    return
  }

  try {
    verifyJWTToken(token)
    return next()
  } catch (error) {
    console.error(`Error in authMiddleware validating token.`)
    res.status(401).json(false)
    return
  }
}
