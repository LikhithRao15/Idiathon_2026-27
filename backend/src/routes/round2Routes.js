const express = require('express');
const router = express.Router();
const round2Controller = require('../controllers/round2Controller');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { round2SubmitValidator } = require('../validators/round2Validator');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @route   POST /api/round2/submit
 * @desc    Submit or save draft for Round 2 (Idea Elaboration)
 * @access  Private (Participant only)
 */
router.post(
  '/submit',
  requireAuth,
  requireRole('participant'),
  round2SubmitValidator,
  validate,
  round2Controller.submitRound2
);

/**
 * @route   GET /api/round2/submission
 * @desc    Get Round 2 submission details
 * @access  Private (Participant / Panelist / Admin)
 */
router.get(
  '/submission',
  requireAuth,
  round2Controller.getRound2Submission
);

/**
 * @route   PUT /api/round2/submission/:id
 * @desc    Update Round 2 submission
 * @access  Private
 */
router.put(
  '/submission/:id',
  requireAuth,
  round2Controller.updateRound2Submission
);

module.exports = router;
