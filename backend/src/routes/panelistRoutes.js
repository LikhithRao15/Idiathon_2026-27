const express = require('express');
const router = express.Router();
const panelistController = require('../controllers/panelistController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Panelist only access
router.use(requireAuth, requireRole('panelist', 'admin'));

/**
 * @route   GET /api/panelists/assigned-teams
 * @desc    Get all teams assigned to the panelist
 * @access  Private (Panelist)
 */
router.get('/assigned-teams', panelistController.getAssignedTeams);

/**
 * @route   GET /api/panelists/assigned-teams/:teamId
 * @desc    Get specific assigned team details
 * @access  Private (Panelist)
 */
router.get('/assigned-teams/:teamId', panelistController.getAssignedTeamDetails);

/**
 * @route   GET /api/panelists/dashboard
 * @desc    Get panelist review summary dashboard
 * @access  Private (Panelist)
 */
router.get('/dashboard', panelistController.getPanelistDashboard);

module.exports = router;
