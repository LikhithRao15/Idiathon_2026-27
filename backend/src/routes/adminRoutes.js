const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All routes here strictly require Admin authentication
router.use(requireAuth, requireRole('admin'));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard metrics, submission stats, and round progress
 * @access  Private (Admin only)
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @route   PUT /api/admin/teams/batch-select-round1
 * @desc    Batch select teams for Round 1
 * @access  Private (Admin only)
 */
router.put('/teams/batch-select-round1', adminController.batchSelectRound1);

/**
 * @route   PUT /api/admin/teams/batch-select-round2
 * @desc    Batch select teams for Round 2
 * @access  Private (Admin only)
 */
router.put('/teams/batch-select-round2', adminController.batchSelectRound2);

/**
 * @route   PUT /api/admin/teams/:teamId/round1/select
 * @desc    Select team in Round 1 and unlock Round 2
 * @access  Private (Admin only)
 */
router.put('/teams/:teamId/round1/select', adminController.selectRound1Team);

/**
 * @route   PUT /api/admin/teams/:teamId/round1/reject
 * @desc    Reject team in Round 1
 * @access  Private (Admin only)
 */
router.put('/teams/:teamId/round1/reject', adminController.rejectRound1Team);

/**
 * @route   PUT /api/admin/teams/:teamId/round2/select
 * @desc    Select team in Round 2 and promote to Grand Finalist
 * @access  Private (Admin only)
 */
router.put('/teams/:teamId/round2/select', adminController.selectRound2Team);

/**
 * @route   PUT /api/admin/teams/:teamId/round2/reject
 * @desc    Reject team in Round 2
 * @access  Private (Admin only)
 */
router.put('/teams/:teamId/round2/reject', adminController.rejectRound2Team);

/**
 * @route   POST /api/admin/finalists
 * @desc    Schedule presentation details for a finalist
 * @access  Private (Admin only)
 */
router.post('/finalists', adminController.scheduleFinalistEvent);

/**
 * @route   GET /api/admin/rounds
 * @desc    Get round configurations and status
 * @access  Private (Admin only)
 */
router.get('/rounds', adminController.getRoundConfigs);

/**
 * @route   PUT /api/admin/rounds/:round/update
 * @desc    Update round status (OPEN/CLOSED) and deadlines
 * @access  Private (Admin only)
 */
router.put('/rounds/:round/update', adminController.updateRoundConfig);

/**
 * @route   GET /api/admin/panelists
 * @desc    Get all panelist accounts
 * @access  Private (Admin only)
 */
router.get('/panelists', adminController.getPanelists);

/**
 * @route   POST /api/admin/panelists
 * @desc    Create a new panelist account
 * @access  Private (Admin only)
 */
router.post('/panelists', adminController.createPanelist);

/**
 * @route   PUT /api/admin/panelists/:id
 * @desc    Update a panelist account
 * @access  Private (Admin only)
 */
router.put('/panelists/:id', adminController.updatePanelist);

/**
 * @route   DELETE /api/admin/panelists/:id
 * @desc    Delete a panelist account
 * @access  Private (Admin only)
 */
router.delete('/panelists/:id', adminController.deletePanelist);

/**
 * @route   POST /api/admin/assign-panelist
 * @desc    Assign a panelist to a team
 * @access  Private (Admin only)
 */
router.post('/assign-panelist', adminController.assignPanelist);

module.exports = router;
