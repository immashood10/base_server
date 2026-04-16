import { Router } from 'express'
import authController from './auth.controller'
import rateLimiter from '../../../middlewares/rateLimiter'
import authenticate from '../../../middlewares/authenticate'
import asyncHandler from '../../../handlers/async'

const router = Router()

router.post('/register', rateLimiter, asyncHandler(authController.register))
router.post('/login', rateLimiter, asyncHandler(authController.login))
router.get('/me', authenticate, asyncHandler(authController.me))

export default router

