const User = require('../models/User');
const Team = require('../models/Team');
const { generateToken } = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/response');
const notificationService = require('../services/notificationService');

/**
 * @desc    Register a new participant
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, city, password } = req.body;
    const cleanEmail = email && typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : undefined;
    const cleanPhone = (phone || '').trim();

    if (!cleanPhone) {
      return sendError(res, 'Phone number is required.', 400);
    }

    // Check duplicate email in registered users only if email is provided
    if (cleanEmail) {
      const existingEmail = await User.findOne({ email: cleanEmail });
      if (existingEmail) {
        return sendError(
          res,
          'A user with this email address already exists. Please login.',
          400
        );
      }

      // Check if this email is already listed as a member in a team created by a leader
      const existingMemberTeam = await Team.findOne({ 'members.email': cleanEmail });
      if (existingMemberTeam) {
        return sendError(
          res,
          `This email is already registered as a team member in team '${existingMemberTeam.teamName}'. Only the team leader can register and manage submissions.`,
          400
        );
      }
    }

    // Check duplicate phone with variant normalization
    const cleanDigits = cleanPhone.replace(/[\s\-\(\)]/g, '');
    const phoneVariants = [cleanPhone, cleanDigits];
    if (cleanDigits.startsWith('+91') && cleanDigits.length === 13) {
      phoneVariants.push(cleanDigits.slice(3));
    } else if (cleanDigits.length === 10) {
      phoneVariants.push(`+91${cleanDigits}`);
    }

    const existingPhone = await User.findOne({ phone: { $in: phoneVariants } });
    if (existingPhone) {
      return sendError(
        res,
        'A user with this phone number already exists.',
        400
      );
    }

    // Check if this phone number is already listed as a member in another team
    const existingMemberByPhone = await Team.findOne({ 'members.phone': { $in: phoneVariants } });
    if (existingMemberByPhone) {
      return sendError(
        res,
        `This phone number is already registered as a team member in team '${existingMemberByPhone.teamName}'.`,
        400
      );
    }

    // Public registration is restricted to participants
    const userRole = 'participant';

    const user = await User.create({
      name,
      email: cleanEmail || undefined,
      phone: cleanPhone,
      city: city ? city.trim() : undefined,
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
          city: user.city,
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
 * @desc    Authenticate user & get JWT token (by Phone Number or Email)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, phone, identifier: rawId, password } = req.body;
    const rawIdentifier = (phone || email || rawId || '').trim();
    if (!rawIdentifier) {
      return sendError(res, 'Phone number is required.', 400);
    }

    const cleanLower = rawIdentifier.toLowerCase();
    const cleanDigits = rawIdentifier.replace(/[\s\-\(\)]/g, '');
    const phoneVariants = [rawIdentifier, cleanDigits];
    if (cleanDigits.startsWith('+91') && cleanDigits.length === 13) {
      phoneVariants.push(cleanDigits.slice(3));
    } else if (cleanDigits.length === 10) {
      phoneVariants.push(`+91${cleanDigits}`);
    }

    // Disallow admin login via phone number
    const adminWithThisPhone = await User.findOne({
      phone: { $in: phoneVariants },
      role: 'admin',
    });

    if (
      adminWithThisPhone &&
      cleanLower !== adminWithThisPhone.email?.toLowerCase() &&
      cleanLower !== 'admin' &&
      cleanLower !== 'admin@123'
    ) {
      return sendError(
        res,
        'Administrators cannot log in using phone number. Please use your Admin Email / ID.',
        403
      );
    }

    // Find user with password - phone login is strictly for non-admin accounts
    const user = await User.findOne({
      $or: [
        { phone: { $in: phoneVariants }, role: { $ne: 'admin' } },
        { email: cleanLower },
        ...(cleanLower === 'admin' ? [{ email: 'admin@123' }] : []),
        ...(cleanLower === 'admin@123' ? [{ email: 'admin' }] : []),
      ],
    }).select('+password');

    if (!user) {
      return sendError(res, 'Invalid phone number or password credentials.', 401);
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
      return sendError(res, 'Invalid phone number or password credentials.', 401);
    }

    // Generate JWT
    const token = generateToken(user);

    // Check team membership
    const teamOrConditions = [{ leader: user._id }];
    if (user.email) teamOrConditions.push({ 'members.email': user.email });
    if (user.phone) {
      const uPhoneDigits = user.phone.replace(/[\s\-\(\)]/g, '');
      teamOrConditions.push({ 'members.phone': { $in: [user.phone, uPhoneDigits] } });
    }

    const userTeam = await Team.findOne({
      $or: teamOrConditions,
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

    const teamOrConditions = [{ leader: user._id }];
    if (user.email) teamOrConditions.push({ 'members.email': user.email });
    if (user.phone) {
      const uPhoneDigits = user.phone.replace(/[\s\-\(\)]/g, '');
      teamOrConditions.push({ 'members.phone': { $in: [user.phone, uPhoneDigits] } });
    }

    const userTeam = await Team.findOne({
      $or: teamOrConditions,
    }).populate('theme', 'name description');

    return sendSuccess(res, 'User details retrieved successfully.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
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
