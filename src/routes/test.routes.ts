import { Router } from 'express'
import { testController } from '../controllers/test.controller'
import { authMiddleware } from '../middlewares/authMiddleware'
import { limitIPRequestMiddleware } from '../middlewares/limitIPRequestMiddleware'

const router = Router()

router.post('/projects', authMiddleware, limitIPRequestMiddleware, testController)
