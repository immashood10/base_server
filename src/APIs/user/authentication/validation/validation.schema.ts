import joi from 'joi'
import { ILoginRequest, IRegisterRequest } from '../types/authentication.interface'
import { EUserRoles } from '../../../../constant/users'

export const registerSchema = joi.object<IRegisterRequest, true>({
    name: joi.string().min(2).max(72).trim().required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().min(4).max(20).required(),
    password: joi
        .string()
        .min(8)
        .max(24)
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .trim()
        .required(),
    role: joi.string().valid(...Object.values(EUserRoles)).default(EUserRoles.USER),
    consent: joi.boolean().valid(true).required()
})

export const loginSchema = joi.object<ILoginRequest, true>({
    email: joi.string().email().required(),
    password: joi
        .string()
        .min(8)
        .max(24)
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .trim()
        .required()
})
