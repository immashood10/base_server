import { initRateLimiter } from '../config/rate-limiter';
import logger from '../handlers/logger';
import database from '../services/database';   // or '../config/database'

export async function bootstrap(): Promise<void> {
    try {
        // Connect to MongoDB
        const connection = await database.connect();
        logger.info(`Database connection established`, {
            meta: { CONNECTION_NAME: connection.name }
        });

        // Initialize rate limiter (if it uses DB or Redis)
        initRateLimiter(connection);
        logger.info(`Rate limiter initiated successfully`);
    } catch (error) {
        logger.error(`Error during bootstrap:`, { meta: error });
        throw error;
    }
}