import winston from 'winston';
import { config } from './config.js';
import { LogEntry } from '@/types/index.js';

/**
 * Custom log format for structured logging
 */
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  })
);

/**
 * Console format for development
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} ${level}: ${message} ${metaStr}`;
  })
);

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'chat-session-mgmt-api' },
  transports: [
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: config.logging.file,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport for development
if (config.environment !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

/**
 * Log HTTP request
 */
export function logRequest(req: any, res: any, duration: number): void {
  const logEntry: LogEntry = {
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

/**
 * Log error with context
 */
export function logError(error: Error, context?: any): void {
  const logEntry: LogEntry = {
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

/**
 * Log info message
 */
export function logInfo(message: string, meta?: any): void {
  logger.info(message, meta);
}

/**
 * Log warning message
 */
export function logWarning(message: string, meta?: any): void {
  logger.warn(message, meta);
}

/**
 * Log debug message
 */
export function logDebug(message: string, meta?: any): void {
  logger.debug(message, meta);
}

/**
 * Log API response
 */
export function logResponse(endpoint: string, method: string, status: number, data?: any): void {
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
  } else {
    logger.info(logEntry.message, logEntry);
  }
}

/**
 * Log security event
 */
export function logSecurityEvent(event: string, details: any): void {
  logger.warn('Security Event', {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
}

export default logger;