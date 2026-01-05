/**
 * Application Constants
 * Centralized configuration constants for the application
 */

module.exports = {
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: 10,

  // URL Shortening
  MAX_URLS_PER_USER: 100,
  SHORT_CODE_LENGTH: 6,
  SHORT_CODE_CHARACTERS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  MAX_SHORT_CODE_GENERATION_ATTEMPTS: 10,

  // Application
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Password Requirements
  MIN_PASSWORD_LENGTH: 6,

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  }
};
