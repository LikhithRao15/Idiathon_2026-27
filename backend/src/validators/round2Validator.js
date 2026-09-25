const { body } = require('express-validator');

const round2SubmitValidator = [
  body('detailedConcept')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Detailed concept is required')
    .isLength({ min: 10 })
    .withMessage('Detailed concept must be at least 10 characters'),
  body('valueProposition')
    .optional()
    .trim(),
  body('valuePropositionAndCircularity')
    .optional()
    .trim(),
  body('feasibilityPlan90Days')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('90-Day feasibility plan is required')
    .isLength({ min: 10 })
    .withMessage('90-Day feasibility plan must be at least 10 characters'),
  body('resourceRequirements')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Resource requirements are required'),
  body('isDraft')
    .optional()
    .isBoolean()
    .withMessage('isDraft must be a boolean value'),
];

module.exports = {
  round2SubmitValidator,
};
