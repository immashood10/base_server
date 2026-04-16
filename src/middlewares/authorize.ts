import { NextFunction, Request, Response } from 'express'
import { IAuthenticateRequest } from '../types/types'
import { EUserRoles } from '../constant/users'
import responseMessage from '../constant/responseMessage'
import { CustomError } from '../utils/errors'

export const authorize = (...allowedRoles: EUserRoles[]) => {
    return (_request: Request, _response: Response, next: NextFunction) => {
        try {
            const request = _request as IAuthenticateRequest
            const { authenticatedUser } = request

            if (!authenticatedUser) {
                throw new CustomError(responseMessage.UNAUTHORIZED, 401)
            }

            const userRole = authenticatedUser.role
            if (!allowedRoles.includes(userRole)) {
                throw new CustomError(responseMessage.UNAUTHORIZED, 403)
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}

export default authorize
