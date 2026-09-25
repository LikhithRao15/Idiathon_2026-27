const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { sendError } = require('../utils/response');

/**
 * Authentication Middleware: Protects routes using JWT
 */
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(
        res,
        'Authentication required. Please provide a valid authorization token.',
        401
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token has expired. Please login again.', 401);
      }
      return sendError(res, 'Invalid token. Authorization denied.', 401);
    }

    // Find user in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return sendError(res, 'User belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'This user account has been deactivated.', 403);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, `Authentication error: ${error.message}`, 500);
  }
};

module.exports = {
  requireAuth,
};
