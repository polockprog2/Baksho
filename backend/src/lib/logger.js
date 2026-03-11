// backend/src/lib/logger.js

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Standardized logger for the backend
 * Provides consistent formatting and severity levels
 */
const logger = {
    info: (message, meta = {}) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
    },
    warn: (message, meta = {}) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
    },
    error: (message, meta = {}) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
    },
    debug: (message, meta = {}) => {
        if (!isProduction) {
            console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
        }
    }
};

export default logger;
