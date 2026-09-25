const express = require('express');
const router = express.Router();
const round1Controller = require('../controllers/round1Controller');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { round1SubmitValidator } = require('../validators/round1Validator');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @route   POST /api/round1/submit
 * @desc    Submit or save draft for Round 1
 * @access  Private (Participant only)
 */
router.post(
  '/submit',
  requireAuth,
  requireRole('participant'),
  round1SubmitValidator,
  validate,
  round1Controller.submitRound1
);

/**
 * @route   GET /api/round1/submission
 * @desc    Get Round 1 submission
 * @access  Private (Participant / Panelist / Admin)
 */
router.get(
  '/submission',
  requireAuth,
  round1Controller.getRound1Submission
);

/**
 * @route   PUT /api/round1/submission/:id
 * @desc    Update Round 1 submission (Draft editing by leader or status change by Admin)
 * @access  Private
 */
router.put(
  '/submission/:id',
  requireAuth,
  round1Controller.updateRound1Submission
);

module.exports = router;
