const rateLimit = require('express-rate-limit')

const windowMs = process.env.LIMITER_TIME ? parseInt(process.env.LIMITER_TIME as string) : 15 * 60 * 1000
const max = process.env.LIMITER_MAX_REQUESTS ? parseInt(process.env.LIMITER_MAX_REQUESTS as string) : 100
export const limitIPRequestMiddleware = rateLimit({
  windowMs: windowMs,
  max: max,
  message: 'Too many request on this endpoint, please try again later.',
  headers: true
})
