import winston from 'winston';
import { config } from './config.js';
const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json(), winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
    });
}));
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} ${level}: ${message} ${metaStr}`;
}));
const logger = winston.createLogger({
    level: config.logging.level,
    format: logFormat,
    defaultMeta: { service: 'chat-session-mgmt-api' },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: config.logging.file,
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});
if (config.environment !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat,
    }));
}
export function logRequest(req, res, duration) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'HTTP Request',
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        duration,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
    };
    logger.info(logEntry.message, logEntry);
}
export function logError(error, context) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level: 'error',
        message: error.message,
        error: {
            name: error.name,
            stack: error.stack,
            ...context,
        },
    };
    logger.error(logEntry.message, logEntry);
}
export function logInfo(message, meta) {
    logger.info(message, meta);
}
export function logWarning(message, meta) {
    logger.warn(message, meta);
}
export function logDebug(message, meta) {
    logger.debug(message, meta);
}
export function logResponse(endpoint, method, status, data) {
    const logEntry = {
        message: 'API Response',
        endpoint,
        method,
        status,
        success: status >= 200 && status < 300,
        dataSize: data ? JSON.stringify(data).length : 0,
    };
    if (status >= 400) {
        logger.error(logEntry.message, logEntry);
    }
    else {
        logger.info(logEntry.message, logEntry);
    }
}
export function logSecurityEvent(event, details) {
    logger.warn('Security Event', {
        event,
        ...details,
        timestamp: new Date().toISOString(),
    });
}
export default logger;
//# sourceMappingURL=logger.js.map