import { Request } from 'express'
import { EUserRoles } from '../../../../constant/users'

export interface IRegisterBody {
    name: string
    email: string
    password: string
    phoneNumber: {
        isoCode: string
        countryCode: string
        internationalNumber: string
    }
    timezone: string
    role?: EUserRoles
    consent: boolean
}

export interface ILoginBody {
    email: string
    password: string
}

export interface IAuthTokens {
    accessToken: string
    refreshToken: string
}

export interface IRegisterRequest extends Request {
    body: IRegisterBody
}

export interface ILoginRequest extends Request {
    body: ILoginBody
}
