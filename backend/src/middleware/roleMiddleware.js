const { sendError } = require('../utils/response');

/**
 * Role-based Authorization Middleware
 * @param  {...string} allowedRoles - List of authorized roles (e.g. 'admin', 'panelist', 'participant')
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required before checking role authorization.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}].`,
        403
      );
    }

    next();
  };
};

module.exports = {
  requireRole,
};
