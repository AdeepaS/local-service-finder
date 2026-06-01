const authService = require('../services/authService');
const { setRefreshTokenCookie } = require('../utils/generateTokens');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  const validation = validateRegister({ name, email, password, role });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const result = await authService.registerUser({ name, email, password, role });

  // Set refresh token cookie
  setRefreshTokenCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result.user,
    accessToken: result.accessToken,
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const validation = validateLogin({ email, password });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const result = await authService.loginUser(email, password);

  // Set refresh token cookie
  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: result.user,
    accessToken: result.accessToken,
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  await authService.logoutUser(refreshToken);

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.jwt;

  const result = await authService.refreshAccessToken(token);

  res.status(200).json({
    success: true,
    accessToken: result.accessToken,
  });
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getMe,
};
