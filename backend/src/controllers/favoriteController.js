const favoriteService = require('../services/favoriteService');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Add a service to favorites
 * @route   POST /api/favorites
 * @access  Private (Customer)
 */
const addFavorite = asyncHandler(async (req, res) => {
  const { serviceId } = req.body;
  const userId = req.user._id;

  if (!serviceId) {
    const error = new Error('Service ID is required');
    error.statusCode = 400;
    throw error;
  }

  const favorite = await favoriteService.addFavorite(userId, serviceId);

  res.status(201).json({
    success: true,
    message: 'Service added to favorites successfully',
    data: favorite,
  });
});

/**
 * @desc    Remove a service from favorites
 * @route   DELETE /api/favorites/:serviceId
 * @access  Private (Customer)
 */
const removeFavorite = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const userId = req.user._id;

  await favoriteService.removeFavorite(userId, serviceId);

  res.status(200).json({
    success: true,
    message: 'Service removed from favorites successfully',
  });
});

/**
 * @desc    Get user's favorite services
 * @route   GET /api/favorites
 * @access  Private (Customer)
 */
const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const result = await favoriteService.getFavorites(userId, {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Check if a service is favorited
 * @route   GET /api/favorites/:serviceId/check
 * @access  Private (Customer)
 */
const checkIsFavorited = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const userId = req.user._id;

  const isFavorited = await favoriteService.checkIsFavorited(userId, serviceId);

  res.status(200).json({
    success: true,
    data: {
      isFavorited,
      serviceId,
    },
  });
});

/**
 * @desc    Toggle favorite (add/remove)
 * @route   POST /api/favorites/:serviceId/toggle
 * @access  Private (Customer)
 */
const toggleFavorite = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const userId = req.user._id;

  const result = await favoriteService.toggleFavorite(userId, serviceId);

  res.status(200).json({
    success: true,
    message: `Service ${result.action} from favorites successfully`,
    data: {
      isFavorited: result.isFavorited,
      serviceId,
    },
  });
});

/**
 * @desc    Get favorite count for a service
 * @route   GET /api/favorites/:serviceId/count
 * @access  Public
 */
const getFavoriteCount = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const count = await favoriteService.getFavoriteCount(serviceId);

  res.status(200).json({
    success: true,
    data: {
      count,
      serviceId,
    },
  });
});

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkIsFavorited,
  toggleFavorite,
  getFavoriteCount,
};
