const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

/**
 * @route   GET /api/participants/event-status
 * @desc    Get event information, active themes, and round availability
 * @access  Public
 */
router.get('/event-status', participantController.getEventStatus);

/**
 * @route   GET /api/participants/dashboard
 * @desc    Get participant overview, stage unlock statuses, and submissions
 * @access  Private (Participant only)
 */
router.get(
  '/dashboard',
  requireAuth,
  requireRole('participant'),
  participantController.getParticipantDashboard
);

/**
 * @route   GET /api/finalists/:teamId
 * @desc    Get finalist event details (accessible by finalist team members or admin/panelist)
 * @access  Private
 */
router.get(
  '/finalists/:teamId',
  requireAuth,
  adminController.getFinalistDetails
);

module.exports = router;
