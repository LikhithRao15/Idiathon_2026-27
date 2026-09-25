class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Standard Success Response Helper
 * @param {Object} res - Express response object
 * @param {String} message - Human readable success message
 * @param {Object|Array|null} data - Payload data
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standard Error Response Helper
 * @param {Object} res - Express response object
 * @param {String} message - Error description message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {Array|Object|null} errors - Detailed validation or error items
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  sendSuccess,
  sendError,
};
