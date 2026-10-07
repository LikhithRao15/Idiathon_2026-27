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
    .custom((val, { req }) => {
      const themeVal = val || req.body.themeId;
      if (!themeVal) {
        throw new Error('Theme selection is required');
      }
      if (!/^[0-9a-fA-F]{24}$/.test(String(themeVal))) {
        throw new Error('Invalid theme ID format');
      }
      req.body.theme = themeVal;
      return true;
    }),
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
    .optional({ checkFalsy: true })
    .trim()
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
