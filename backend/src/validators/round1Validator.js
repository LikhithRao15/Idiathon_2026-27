const { body } = require('express-validator');

const round1SubmitValidator = [
  body('problemStatement')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Problem statement is required')
    .isLength({ min: 15 })
    .withMessage('Problem statement must be at least 15 characters'),
  body('proposedSolution')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Proposed solution is required')
    .isLength({ min: 20 })
    .withMessage('Proposed solution must be at least 20 characters'),
  body('themeId')
    .optional()
    .isMongoId()
    .withMessage('Invalid theme ID format'),
  body('isDraft')
    .optional()
    .isBoolean()
    .withMessage('isDraft must be a boolean value'),
];

module.exports = {
  round1SubmitValidator,
};
