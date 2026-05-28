const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Protect routes - Verifies JWT access token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret');

      // Get user from the token (exclude password and refresh token)
      req.user = await User.findById(decoded.id).select('-password -refreshToken');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      if (error.name === 'TokenExpiredError') {
         return res.status(401).json({ success: false, message: 'Not authorized, token expired', expired: true });
      }
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
