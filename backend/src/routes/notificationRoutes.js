const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

/**
 * @route   GET /api/notifications
 * @desc    Get current user's notifications
 * @access  Private
 */
router.get('/', notificationController.getNotifications);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.patch('/:id/read', notificationController.markAsRead);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all user notifications as read
 * @access  Private
 */
router.patch('/read-all', notificationController.markAllAsRead);

module.exports = router;
