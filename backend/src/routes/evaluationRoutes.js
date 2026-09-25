const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const {
  round1EvaluationValidator,
  round2EvaluationValidator,
  finalRoundEvaluationValidator,
} = require('../validators/evaluationValidator');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @route   POST /api/evaluations/round1
 * @desc    Submit Round 1 Evaluation
 * @access  Private (Panelist, Admin)
 */
router.post(
  '/round1',
  requireAuth,
  requireRole('panelist', 'admin'),
  round1EvaluationValidator,
  validate,
  evaluationController.evaluateRound1
);

/**
 * @route   GET /api/evaluations/round1
 * @desc    Get Round 1 Evaluations
 * @access  Private (Panelist, Admin)
 */
router.get(
  '/round1',
  requireAuth,
  requireRole('panelist', 'admin'),
  evaluationController.getRound1Evaluations
);

/**
 * @route   POST /api/evaluations/round2
 * @desc    Submit Round 2 Evaluation
 * @access  Private (Panelist, Admin)
 */
router.post(
  '/round2',
  requireAuth,
  requireRole('panelist', 'admin'),
  round2EvaluationValidator,
  validate,
  evaluationController.evaluateRound2
);

/**
 * @route   GET /api/evaluations/round2
 * @desc    Get Round 2 Evaluations
 * @access  Private (Panelist, Admin)
 */
router.get(
  '/round2',
  requireAuth,
  requireRole('panelist', 'admin'),
  evaluationController.getRound2Evaluations
);

/**
 * @route   POST /api/evaluations/final
 * @desc    Submit Final Round Evaluation
 * @access  Private (Panelist, Admin)
 */
router.post(
  '/final',
  requireAuth,
  requireRole('panelist', 'admin'),
  finalRoundEvaluationValidator,
  validate,
  evaluationController.evaluateFinalRound
);

/**
 * @route   GET /api/evaluations/team/:teamId
 * @desc    Get all evaluation scores across rounds for a team
 * @access  Private (Panelist, Admin)
 */
router.get(
  '/team/:teamId',
  requireAuth,
  requireRole('panelist', 'admin'),
  evaluationController.getTeamEvaluationSummary
);

module.exports = router;
