const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { createThemeValidator, updateThemeValidator } = require('../validators/themeValidator');
const { validate } = require('../middleware/validationMiddleware');

/**
 * @route   GET /api/themes
 * @desc    Get themes (Active for participants, all for admin)
 * @access  Public / Authenticated
 */
router.get('/', themeController.getThemes);

/**
 * @route   GET /api/themes/:id
 * @desc    Get theme by ID
 * @access  Public / Authenticated
 */
router.get('/:id', themeController.getThemeById);

/**
 * @route   POST /api/themes
 * @desc    Create a new theme track
 * @access  Private (Admin only)
 */
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  createThemeValidator,
  validate,
  themeController.createTheme
);

/**
 * @route   PUT /api/themes/:id
 * @desc    Update a theme track
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  updateThemeValidator,
  validate,
  themeController.updateTheme
);

/**
 * @route   DELETE /api/themes/:id
 * @desc    Delete a theme track
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  themeController.deleteTheme
);

module.exports = router;
