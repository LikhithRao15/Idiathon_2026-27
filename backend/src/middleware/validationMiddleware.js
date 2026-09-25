const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Middleware to evaluate express-validator rules and return formatted error response
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return sendError(
      res,
      'Validation failed. Please check the input fields.',
      400,
      formattedErrors
    );
  }
  next();
};

module.exports = {
  validate,
};
