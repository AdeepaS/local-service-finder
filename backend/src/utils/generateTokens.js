const jwt = require('jsonwebtoken');

/**
 * Generate Access Token (Short-lived, e.g., 15 minutes)
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret', {
    expiresIn: '15m',
  });
};

/**
 * Generate Refresh Token (Long-lived, e.g., 7 days)
 */
const generateRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
    expiresIn: '7d',
  });
};

/**
 * Set Refresh Token in HTTP-Only Cookie
 */
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'strict', // Prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
};
