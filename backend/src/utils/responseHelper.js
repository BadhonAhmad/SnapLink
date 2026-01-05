/**
 * API Response Helper Utilities
 * Standardizes API responses across the application
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} additionalData - Additional error data
 */
const sendError = (res, message = 'An error occurred', statusCode = 500, additionalData = {}) => {
  const response = {
    success: false,
    message,
    ...additionalData
  };

  return res.status(statusCode).json(response);
};

/**
 * Handle service errors and send appropriate response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object from service
 */
const handleServiceError = (res, error) => {
  // Check if error has custom status code
  const statusCode = error.statusCode || 500;
  
  // Include additional error properties if present
  const additionalData = {};
  if (error.limitReached !== undefined) {
    additionalData.limitReached = error.limitReached;
  }

  // Log error for debugging (in production, use proper logging service)
  if (statusCode === 500) {
    console.error('Server Error:', error);
  }

  return sendError(res, error.message, statusCode, additionalData);
};

module.exports = {
  sendSuccess,
  sendError,
  handleServiceError
};
