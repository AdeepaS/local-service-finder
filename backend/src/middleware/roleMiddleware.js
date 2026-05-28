/**
 * Role-Based Access Control (RBAC) middleware
 * 
 * @param  {...string} roles - Array of allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user ? req.user.role : 'none'}) is not allowed to access this resource`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
