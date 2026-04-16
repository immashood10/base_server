import { NextFunction, Request, Response } from 'express'
import config from '../config/config'
import { rateLimiterMongo } from '../config/rate-limiter'
import httpError from '../handlers/errorHandler/httpError'
import responseMessage from '../constant/responseMessage'

export default (req: Request, _: Response, next: NextFunction) => {
    if (config.ENV === 'development') {
        return next()
    }

    if (rateLimiterMongo) {
        rateLimiterMongo
            .consume(req.ip as string, 1)
            .then(() => {
                next()
            })
            .catch(() => {
                httpError(next, new Error(responseMessage.TOO_MANY_REQUESTS), req, 429)
            })
    }
}
