const { body } = require('express-validator');
const env = require('../config/env');

const createTeamValidator = [
  body('teamName')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Team name must be between 3 and 100 characters'),
  body('theme')
    .notEmpty()
    .withMessage('Theme selection is required')
    .isMongoId()
    .withMessage('Invalid theme ID format'),
  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array')
    .custom((members) => {
      if (members && members.length > env.MAX_TEAM_SIZE - 1) {
        throw new Error(
          `Team cannot exceed ${env.MAX_TEAM_SIZE} members including the leader`
        );
      }
      return true;
    }),
  body('members.*.name')
    .if(body('members').exists())
    .trim()
    .notEmpty()
    .withMessage('Member name is required'),
  body('members.*.email')
    .if(body('members').exists())
    .trim()
    .notEmpty()
    .withMessage('Member email is required')
    .isEmail()
    .withMessage('Member email must be a valid email address')
    .normalizeEmail(),
  body('members.*.phone')
    .if(body('members').exists())
    .trim()
    .notEmpty()
    .withMessage('Member phone is required')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/)
    .withMessage('Member phone must be a valid phone number'),
];

module.exports = {
  createTeamValidator,
};
