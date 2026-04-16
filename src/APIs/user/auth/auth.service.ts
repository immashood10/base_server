import { EUserRoles } from '../../../constant/users'
import query from '../_shared/repo/user.repository'
import hashing from '../../../utils/hashing'
import jwt from '../../../utils/jwt'
import config from '../../../config/config'
import responseMessage from '../../../constant/responseMessage'
import { IRegisterBody, ILoginBody, IAuthTokens } from './types/auth.interface'
import { CustomError } from '../../../utils/errors'
import code from '../../../utils/code'

export default {
    register: async (body: IRegisterBody) => {
        const { email, password, name, phoneNumber, timezone, role = EUserRoles.USER, consent } = body
        const normalizedEmail = email.trim().toLowerCase()

        const existingUser = await query.findUserByEmail(normalizedEmail)
        if (existingUser) {
            throw new CustomError(responseMessage.auth.ALREADY_EXISTS('User', 'email'), 409)
        }

        const hashedPassword = await hashing.hashPassword(password)

        const user = await query.createUser({
            name,
            email: normalizedEmail,
            phoneNumber,
            timezone,
            password: hashedPassword,
            role,
            consent,
            accountConfimation: {
                status: true,
                token: code.generateRandomId(),
                code: code.generateOTP(6),
                timestamp: new Date()
            },
            passwordReset: {
                token: null,
                expiry: null,
                lastResetAt: null
            },
            lastLoginAt: null
        })

        const tokens = generateTokens(user._id.toString(), user.role)

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            ...tokens
        }
    },

    login: async (body: ILoginBody) => {
        const { email, password } = body
        const normalizedEmail = email.trim().toLowerCase()

        const user = await query.findUserByEmail(normalizedEmail, '+password')
        if (!user) {
            throw new CustomError(responseMessage.auth.INVALID_EMAIL_OR_PASSWORD, 401)
        }

        const isPasswordValid = await hashing.comparePassword(password, user.password)
        if (!isPasswordValid) {
            throw new CustomError(responseMessage.auth.INVALID_EMAIL_OR_PASSWORD, 401)
        }

        const tokens = generateTokens(user._id.toString(), user.role)

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            ...tokens
        }
    }
}

function generateTokens(userId: string, role: EUserRoles): IAuthTokens {
    const accessToken = jwt.generateToken({ userId, role }, config.TOKENS.ACCESS.SECRET, config.TOKENS.ACCESS.EXPIRY)

    const refreshToken = jwt.generateToken({ userId, role }, config.TOKENS.REFRESH.SECRET, config.TOKENS.REFRESH.EXPIRY)

    return { accessToken, refreshToken }
}

