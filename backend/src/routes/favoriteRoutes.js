const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

// Favorite endpoints - all require authentication except count
router.post('/', protect, favoriteController.addFavorite);
router.delete('/:serviceId', protect, favoriteController.removeFavorite);
router.get('/', protect, favoriteController.getFavorites);
router.get('/:serviceId/check', protect, favoriteController.checkIsFavorited);
router.post('/:serviceId/toggle', protect, favoriteController.toggleFavorite);

// Public endpoint - favorite count for a service
router.get('/:serviceId/count', favoriteController.getFavoriteCount);

module.exports = router;
