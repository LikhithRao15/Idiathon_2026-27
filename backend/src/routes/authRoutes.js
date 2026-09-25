const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { validate } = require('../middleware/validationMiddleware');
const { requireAuth } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidator, validate, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login and obtain JWT token
 * @access  Public
 */
router.post('/login', loginValidator, validate, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user profile
 * @access  Private
 */
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
