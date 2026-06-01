/**
 * User Profile Business Logic Service
 * Handles user profile operations: get, update, password change, avatar upload
 */

const User = require('../models/user');

const userService = {
  /**
   * Get user profile
   * @param {string} userId
   * @returns {Object} User profile (without password and refresh token)
   */
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password -refreshToken');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },

  /**
   * Update user profile
   * @param {string} userId
   * @param {Object} updateData - { name, phone, profile: { location, profileImage, ... } }
   * @returns {Object} Updated user profile
   */
  async updateProfile(userId, updateData) {
    const { name, phone, profile } = updateData;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Update basic fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    // Update profile object
    if (profile !== undefined && typeof profile === 'object') {
      if (profile.location !== undefined) user.profile.location = profile.location;
      if (profile.profileImage !== undefined) user.profile.profileImage = profile.profileImage;
      if (profile.businessName !== undefined) user.profile.businessName = profile.businessName;
      if (profile.experience !== undefined) user.profile.experience = profile.experience;
      if (profile.description !== undefined) user.profile.description = profile.description;
    }

    await user.save();

    // Return updated user without sensitive fields
    return user.toObject({ virtuals: true, _id: true });
  },

  /**
   * Upload and update user avatar
   * @param {string} userId
   * @param {string} imageUrl - Cloudinary URL
   * @returns {Object} Updated user profile
   */
  async uploadAvatar(userId, imageUrl) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.profile.profileImage = imageUrl;
    await user.save();

    return user;
  },

  /**
   * Change user password
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    // Update password (will be hashed by mongoose pre-save hook)
    user.password = newPassword;
    await user.save();
  },
};

module.exports = userService;
