const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per `window` (here, per 15 minutes)
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' },
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

module.exports = router;
