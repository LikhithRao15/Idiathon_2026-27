const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { createTeamValidator } = require('../validators/teamValidator');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @route   POST /api/teams
 * @desc    Create a new team
 * @access  Private (Participant only)
 */
router.post(
  '/',
  requireAuth,
  requireRole('participant'),
  createTeamValidator,
  validate,
  teamController.createTeam
);

/**
 * @route   GET /api/teams/my-team
 * @desc    Get currently logged in participant's team
 * @access  Private (Participant only)
 */
router.get(
  '/my-team',
  requireAuth,
  requireRole('participant'),
  teamController.getMyTeam
);

/**
 * @route   PUT /api/teams/my-team
 * @desc    Update team information before official submission
 * @access  Private (Participant Leader only)
 */
router.put(
  '/my-team',
  requireAuth,
  requireRole('participant'),
  teamController.updateMyTeam
);

/**
 * @route   GET /api/teams
 * @desc    Get all teams (Admin or Panelist view)
 * @access  Private (Admin, Panelist)
 */
router.get(
  '/',
  requireAuth,
  requireRole('admin', 'panelist'),
  teamController.getAllTeams
);

/**
 * @route   GET /api/teams/:id
 * @desc    Get team by ID
 * @access  Private
 */
router.get(
  '/:id',
  requireAuth,
  teamController.getTeamById
);

module.exports = router;
