const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } = require('../utils/generateTokens');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
    });

    if (user) {
      // Generate Tokens
      const accessToken = generateAccessToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id, user.role);

      // Save refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      // Set cookie
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email, importantly select the password since it's default false
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Generate Tokens
      const accessToken = generateAccessToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id, user.role);

      // Save refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      // Set cookie
      setRefreshTokenCookie(res, refreshToken);

      res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const user = await User.findOne({ refreshToken });
    if (user) {
      // Delete refreshToken in db
      user.refreshToken = '';
      await user.save();
    }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    
    if (!cookies?.jwt) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const token = cookies.jwt;

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ success: false, message: 'Forbidden' });

    // Evaluate jwt
    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
      (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) return res.status(403).json({ success: false, message: 'Forbidden' });
        
        const accessToken = generateAccessToken(user._id, user.role);
        res.json({ success: true, accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe,
};
