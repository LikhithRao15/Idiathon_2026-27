const User = require('../models/User');
const Team = require('../models/Team');
const { generateToken } = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/response');
const notificationService = require('../services/notificationService');

/**
 * @desc    Register a new participant (or panelist/admin via seed/registration)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check duplicate email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return sendError(
        res,
        'A user with this email address already exists. Please login.',
        400
      );
    }

    // Check duplicate phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return sendError(
        res,
        'A user with this phone number already exists.',
        400
      );
    }

    // Default role is participant; admin/panelist can only be set if not explicitly prohibited
    const userRole = role && ['participant', 'panelist', 'admin'].includes(role) ? role : 'participant';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: userRole,
    });

    // Generate JWT
    const token = generateToken(user);

    // Send async registration notification (Email, In-App, SMS)
    notificationService.notifyRegistration(user).catch((err) => {
      console.error('[Notification Trigger Error]', err.message);
    });

    return sendSuccess(
      res,
      'Registration successful. Welcome to the Ideathon!',
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    if (!user.isActive) {
      return sendError(
        res,
        'Your account has been deactivated. Please contact the administrator.',
        403
      );
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    // Generate JWT
    const token = generateToken(user);

    // Check team membership
    const userTeam = await Team.findOne({
      $or: [{ leader: user._id }, { 'members.email': user.email }],
    }).select('teamId teamName round1Status round2Status finalStatus');

    return sendSuccess(res, 'Login successful.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        team: userTeam || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    const userTeam = await Team.findOne({
      $or: [{ leader: user._id }, { 'members.email': user.email }],
    }).populate('theme', 'name description');

    return sendSuccess(res, 'User details retrieved successfully.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        team: userTeam || null,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
