const userService = require('../services/userService');
const { validateUpdateProfile } = require('../validators/userValidator');
const { validateChangePassword } = require('../validators/authValidator');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await userService.getProfile(userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, phone, profile } = req.body;

  // Validate input
  const validation = validateUpdateProfile({ name, phone, profile });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const user = await userService.updateProfile(userId, {
    name,
    phone,
    profile,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

/**
 * @desc    Upload user avatar
 * @route   PUT /api/users/avatar
 * @access  Private
 */
const uploadAvatar = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const imageUrl = req.body.imageUrl; // Assuming imageUrl is passed in body or processed from file

  if (!imageUrl) {
    const error = new Error('Image URL is required');
    error.statusCode = 400;
    throw error;
  }

  const user = await userService.uploadAvatar(userId, imageUrl);

  res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: user,
  });
});

/**
 * @desc    Change user password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  // Validate input
  const validation = validateChangePassword({ currentPassword, newPassword });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  await userService.changePassword(userId, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
};
