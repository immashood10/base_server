import { createLogger, format, transports } from 'winston'
import util from 'util'
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports'
import config from '../config/config'
import path from 'path'

import * as sourceMapSupport from 'source-map-support'
import { blue, green, magenta, red, yellow } from 'colorette'

import 'winston-mongodb'
import { MongoDBTransportInstance } from 'winston-mongodb'

//linking source map
sourceMapSupport.install()

const colorize = (level: string) => {
    switch (level) {
        case 'ERROR':
            return red(level)
        case 'INFO':
            return blue(level)
        case 'WARN':
            return yellow(level)
        default:
            return level
    }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const logFormat = format.printf((info) => {
     
    const { level, message, timestamp, meta = {} } = info

    const customLevel = colorize(level.toUpperCase())

    const customTimestamp = green(timestamp as string)
     
    const customMessage = message
    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true
    })

    const customLog = `${customLevel} [${customTimestamp}] ${customMessage as string}\n${magenta('Meta')} ${customMeta}\n`

    return customLog
})

const fileFormat = format.printf((info) => {
     
    const { level, message, timestamp, meta = {} } = info

    const logMeta: Record<string, unknown> = {}
    const metaRecord = isRecord(meta) ? meta : {}

    for (const [key, value] of Object.entries(metaRecord)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack || ''
            }
        } else {
            logMeta[key] = value
        }
    }

    const logData = {
        level: level.toUpperCase(),
         
        timestamp,
         
        message,
        meta: logMeta
    }

    return JSON.stringify(logData, null, 4)
})

const consoleTransport = (): Array<ConsoleTransportInstance> => {
    if (config.ENV === 'development') {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), logFormat)
            })
        ]
    }
    return []
}

const fileTransport = (): Array<FileTransportInstance> => {
    return [
        new transports.File({
            filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
            level: 'info',
            format: format.combine(format.timestamp(), fileFormat)
        })
    ]
}

const dbTransport = (): Array<MongoDBTransportInstance> => {
    if (config.ENV === 'development' || !config.DATABASE_URL) {
        return []
    }

    return [
        new transports.MongoDB({
            level: 'info',
            db: config.DATABASE_URL,
            metaKey: 'meta',
            expireAfterSeconds: 3600 * 24 * 30,
            collection: 'logs'
        })
    ]
}

export default createLogger({
    defaultMeta: {
        meta: {}
    },
    transports: [...fileTransport(), ...dbTransport(), ...consoleTransport()]
})
