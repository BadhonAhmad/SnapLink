/**
 * Logger Utility
 * Simple logging utility for development and production
 * In production, consider using winston or bunyan
 */

const { NODE_ENV } = require('./constants');

/**
 * Log levels
 */
const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {string} Formatted log message
 */
const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

/**
 * Logger object with different log methods
 */
const logger = {
  /**
   * Log info message
   */
  info: (message, meta = {}) => {
    console.log(formatLog(LogLevel.INFO, message, meta));
  },

  /**
   * Log warning message
   */
  warn: (message, meta = {}) => {
    console.warn(formatLog(LogLevel.WARN, message, meta));
  },

  /**
   * Log error message
   */
  error: (message, error = null, meta = {}) => {
    const errorMeta = error ? { ...meta, error: error.message, stack: error.stack } : meta;
    console.error(formatLog(LogLevel.ERROR, message, errorMeta));
  },

  /**
   * Log debug message (only in development)
   */
  debug: (message, meta = {}) => {
    if (NODE_ENV === 'development') {
      console.log(formatLog(LogLevel.DEBUG, message, meta));
    }
  }
};

module.exports = logger;
