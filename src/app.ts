import express, { Application } from 'express'
import path from 'path'
import router from './APIs'
import errorHandler from './middlewares/errorHandler'
import notFound from './handlers/notFound'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app: Application = express()

const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://xyz.com'
]

// Middlewares
// helmet MUST come before cors, but crossOriginResourcePolicy must be disabled
// so browsers are not blocked from reading cross-origin responses
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
)
app.use(cookieParser())
app.use(
    cors({
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'HEAD', 'PUT', 'PATCH'],
        origin: (origin, callback) => {
            // Allow requests with no origin (Postman, curl, server-to-server)
            if (!origin) return callback(null, true)
            if (ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error(`CORS: Origin ${origin} not allowed`))
            }
        },
        credentials: true
    })
)
// Explicitly handle preflight OPTIONS for all routes
app.options('*', cors())

app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))

// Router
router(app)

// 404 handler
app.use(notFound)

// Error handler
app.use(errorHandler)

export default app
