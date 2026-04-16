import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

const config = {
    // General
    ENV: process.env.ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    SERVER_URL: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`,

    // Database
    DATABASE_URL: process.env.DATABASE_URL || process.env.MONGODB_URI,

    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://xyz.com',

    // Email
    EMAIL_API_KEY: process.env.EMAIL_SERVICE_API_KEY,

    // JWT Tokens
    TOKENS: {
        ACCESS: {
            SECRET: process.env.ACCESS_TOKEN_SECRET as string,
            EXPIRY: 3600 // 1 hour
        },
        REFRESH: {
            SECRET: process.env.REFRESH_TOKEN_SECRET as string,
            EXPIRY: 3600 * 24 * 365 // 1 year
        }
    }
}

export default config
