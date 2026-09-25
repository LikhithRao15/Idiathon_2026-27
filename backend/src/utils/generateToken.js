const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate a signed JWT for authentication
 * Payload contains userId, role, and email
 */
const generateToken = (user) => {
  const payload = {
    userId: user._id ? user._id.toString() : user.id,
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify a given JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
