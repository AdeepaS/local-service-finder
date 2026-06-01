const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Profile endpoints
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/avatar', userController.uploadAvatar);

// Password endpoint
router.put('/change-password', userController.changePassword);

module.exports = router;
