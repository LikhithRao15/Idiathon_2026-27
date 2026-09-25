const { body } = require('express-validator');

const createThemeValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Theme name is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Theme name must be between 3 and 150 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Theme description is required')
    .isLength({ min: 10 })
    .withMessage('Theme description must be at least 10 characters long'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

const updateThemeValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Theme name cannot be empty')
    .isLength({ min: 3, max: 150 })
    .withMessage('Theme name must be between 3 and 150 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Theme description cannot be empty'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

module.exports = {
  createThemeValidator,
  updateThemeValidator,
};
