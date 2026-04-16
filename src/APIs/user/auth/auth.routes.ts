import { Router, Request, Response, NextFunction } from 'express'
import authController from './auth.controller'
import rateLimiter from '../../../middlewares/rateLimiter'
import authenticate from '../../../middlewares/authenticate'

const router = Router()

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

router.post('/register', rateLimiter, asyncHandler(authController.register))
router.post('/login', rateLimiter, asyncHandler(authController.login))
router.get('/me', authenticate, asyncHandler(authController.me))

export default router

