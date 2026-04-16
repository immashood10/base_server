import { NextFunction, Request, Response } from 'express'
import httpResponse from '../../../handlers/httpResponse'
import responseMessage from '../../../constant/responseMessage'
import httpError from '../../../handlers/errorHandler/httpError'
import { CustomError } from '../../../utils/errors'
import authService from './auth.service'
import { IAuthenticateRequest } from '../../../types/types'
import { ILoginRequest, IRegisterRequest } from './types/auth.interface'

export default {
    register: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const authRequest = request as IRegisterRequest
            const result = await authService.register(authRequest.body)
            httpResponse(response, request, 201, responseMessage.auth.USER_REGISTERED, result)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    },

    login: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const authRequest = request as ILoginRequest
            const result = await authService.login(authRequest.body)
            httpResponse(response, request, 200, responseMessage.auth.LOGIN_SUCCESSFUL, result)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    },

    me: (request: Request, response: Response, next: NextFunction) => {
        try {
            const { authenticatedUser } = request as IAuthenticateRequest
            httpResponse(response, request, 200, responseMessage.SUCCESS, authenticatedUser)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    }
}
