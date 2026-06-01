/**
 * Authentication Business Logic Service
 * Handles user registration, login, logout, and token management
 */

const User = require('../models/user');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, role }
   * @returns {Object} { accessToken, refreshToken, user }
   */
  async registerUser(userData) {
    const { name, email, password, role = 'customer' } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Object} { accessToken, refreshToken, user }
   */
  async loginUser(email, password) {
    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  /**
   * Logout user by clearing refresh token
   * @param {string} refreshToken
   */
  async logoutUser(refreshToken) {
    if (!refreshToken) {
      return; // No token to clear
    }

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = '';
      await user.save();
    }
  },

  /**
   * Verify refresh token and generate new access token
   * @param {string} refreshToken
   * @returns {Object} { accessToken, user }
   */
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 403;
      throw error;
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id, user.role);

    return {
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  /**
   * Get full user profile
   * @param {string} userId
   * @returns {Object} User profile data
   */
  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password -refreshToken');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },
};

module.exports = authService;
