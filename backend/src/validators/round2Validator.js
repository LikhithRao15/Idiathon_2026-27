const { body } = require('express-validator');

const round2SubmitValidator = [
  body('detailedConcept')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Detailed concept is required')
    .isLength({ min: 20 })
    .withMessage('Detailed concept must be at least 20 characters'),
  body('problemAnalysis')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Problem analysis is required')
    .isLength({ min: 20 })
    .withMessage('Problem analysis must be at least 20 characters'),
  body('proposedSolution')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Proposed solution is required')
    .isLength({ min: 20 })
    .withMessage('Proposed solution must be at least 20 characters'),
  body('valueProposition')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Value proposition is required')
    .isLength({ min: 10 })
    .withMessage('Value proposition must be at least 10 characters'),
  body('feasibilityPlan90Days')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('90-Day feasibility plan is required')
    .isLength({ min: 20 })
    .withMessage('90-Day feasibility plan must be at least 20 characters'),
  body('resourceRequirements')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Resource requirements are required'),
  body('expectedImpact')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Expected impact is required'),
  body('scalability')
    .if(body('isDraft').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Scalability plan is required'),
  body('isDraft')
    .optional()
    .isBoolean()
    .withMessage('isDraft must be a boolean value'),
];

module.exports = {
  round2SubmitValidator,
};
