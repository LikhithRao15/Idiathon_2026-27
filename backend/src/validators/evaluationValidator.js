const { body } = require('express-validator');

const round1EvaluationValidator = [
  body('teamId')
    .notEmpty()
    .withMessage('Team ID is required')
    .isMongoId()
    .withMessage('Invalid Team ID format'),
  body('scores')
    .notEmpty()
    .withMessage('Scores object is required')
    .isObject()
    .withMessage('Scores must be an object with criterion marks'),
  body('scores.problemUnderstanding')
    .notEmpty()
    .withMessage('Problem Understanding score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Problem Understanding score must be between 0 and 10'),
  body('scores.innovation')
    .notEmpty()
    .withMessage('Innovation score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Innovation score must be between 0 and 10'),
  body('scores.proposedSolution')
    .notEmpty()
    .withMessage('Proposed Solution score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Proposed Solution score must be between 0 and 10'),
  body('scores.feasibility')
    .notEmpty()
    .withMessage('Feasibility score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Feasibility score must be between 0 and 10'),
  body('scores.expectedImpact')
    .notEmpty()
    .withMessage('Expected Impact score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Expected Impact score must be between 0 and 10'),
  body('comments')
    .optional()
    .isString()
    .trim(),
];

const round2EvaluationValidator = [
  body('teamId')
    .notEmpty()
    .withMessage('Team ID is required')
    .isMongoId()
    .withMessage('Invalid Team ID format'),
  body('scores')
    .notEmpty()
    .withMessage('Scores object is required')
    .isObject()
    .withMessage('Scores must be an object with criterion marks'),
  body('scores.conceptClarity')
    .notEmpty()
    .withMessage('Concept Clarity score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Concept Clarity score must be between 0 and 10'),
  body('scores.innovation')
    .notEmpty()
    .withMessage('Innovation score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Innovation score must be between 0 and 10'),
  body('scores.valueProposition')
    .notEmpty()
    .withMessage('Value Proposition score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Value Proposition score must be between 0 and 10'),
  body('scores.technicalFeasibility')
    .notEmpty()
    .withMessage('Technical Feasibility score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Technical Feasibility score must be between 0 and 10'),
  body('scores.feasibilityPlan90Days')
    .notEmpty()
    .withMessage('90-Day Feasibility score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('90-Day Feasibility score must be between 0 and 10'),
  body('scores.resourcePlanning')
    .notEmpty()
    .withMessage('Resource Planning score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Resource Planning score must be between 0 and 10'),
  body('scores.expectedImpact')
    .notEmpty()
    .withMessage('Expected Impact score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Expected Impact score must be between 0 and 10'),
  body('scores.scalability')
    .notEmpty()
    .withMessage('Scalability score is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Scalability score must be between 0 and 10'),
  body('comments')
    .optional()
    .isString()
    .trim(),
];

const finalRoundEvaluationValidator = [
  body('teamId')
    .notEmpty()
    .withMessage('Team ID is required')
    .isMongoId()
    .withMessage('Invalid Team ID format'),
  body('scores')
    .notEmpty()
    .withMessage('Scores object is required')
    .isObject(),
  body('scores.problemDefinition')
    .notEmpty()
    .withMessage('Problem Definition score is required')
    .isFloat({ min: 0, max: 10 }),
  body('scores.innovation')
    .notEmpty()
    .withMessage('Innovation score is required')
    .isFloat({ min: 0, max: 10 }),
  body('scores.solutionQuality')
    .notEmpty()
    .withMessage('Solution Quality score is required')
    .isFloat({ min: 0, max: 10 }),
  body('scores.implementation')
    .notEmpty()
    .withMessage('Implementation score is required')
    .isFloat({ min: 0, max: 10 }),
  body('scores.impact')
    .notEmpty()
    .withMessage('Impact score is required')
    .isFloat({ min: 0, max: 10 }),
  body('scores.presentation')
    .notEmpty()
    .withMessage('Presentation score is required')
    .isFloat({ min: 0, max: 10 }),
  body('scores.qa')
    .notEmpty()
    .withMessage('Q&A score is required')
    .isFloat({ min: 0, max: 10 }),
  body('comments')
    .optional()
    .isString()
    .trim(),
];

module.exports = {
  round1EvaluationValidator,
  round2EvaluationValidator,
  finalRoundEvaluationValidator,
};
