import { Request, Response } from 'express'
import { THttpResponse } from '../types/types'
import config from '../config/config'
import logger from './logger'

export default (res: Response, req: Request, responseStatusCode: number, responseMessage: string, data: unknown): void => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: responseMessage,
        data: data
    }

    logger.info(`Controller Response`, { meta: response })

    if (config.ENV === 'production') {
        delete response.request.ip
    }

    res.status(responseStatusCode).json(response)
}
