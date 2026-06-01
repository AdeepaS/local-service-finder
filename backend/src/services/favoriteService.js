/**
 * Favorite Business Logic Service
 * Handles customer's bookmarked/favorite services
 */

const Favorite = require('../models/favorite');
const Service = require('../models/Service');
const mongoose = require('mongoose');

const favoriteService = {
  /**
   * Add a service to favorites
   * @param {string} userId
   * @param {string} serviceId
   * @returns {Object} Created favorite
   */
  async addFavorite(userId, serviceId) {
    // Verify service exists
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid service ID');
      error.statusCode = 400;
      throw error;
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, serviceId });

    if (existingFavorite) {
      const error = new Error('Service is already in your favorites');
      error.statusCode = 409;
      throw error;
    }

    const favorite = new Favorite({ userId, serviceId });
    await favorite.save();

    return favorite;
  },

  /**
   * Remove a service from favorites
   * @param {string} userId
   * @param {string} serviceId
   */
  async removeFavorite(userId, serviceId) {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid service ID');
      error.statusCode = 400;
      throw error;
    }

    const favorite = await Favorite.findOne({ userId, serviceId });

    if (!favorite) {
      const error = new Error('Service is not in your favorites');
      error.statusCode = 404;
      throw error;
    }

    await favorite.deleteOne();
  },

  /**
   * Get user's favorites
   * @param {string} userId
   * @param {Object} options - { page, limit }
   * @returns {Object} { favorites, pagination }
   */
  async getFavorites(userId, options = {}) {
    const { page = 1, limit = 10 } = options;

    const skip = (page - 1) * limit;

    const [total, favorites] = await Promise.all([
      Favorite.countDocuments({ userId }),
      Favorite.find({ userId })
        .populate({
          path: 'serviceId',
          select: 'title category location priceRange images ratingAverage totalReviews providerId',
          populate: {
            path: 'providerId',
            select: 'name profile.profileImage',
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const pages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      favorites: favorites.map(fav => ({
        _id: fav._id,
        service: fav.serviceId,
        addedAt: fav.createdAt,
      })),
      pagination: { total, page, pages, limit },
    };
  },

  /**
   * Check if a service is favorited by user
   * @param {string} userId
   * @param {string} serviceId
   * @returns {boolean} Is favorited
   */
  async checkIsFavorited(userId, serviceId) {
    const favorite = await Favorite.findOne({ userId, serviceId });
    return !!favorite;
  },

  /**
   * Get favorite count for a service
   * @param {string} serviceId
   * @returns {number} Favorite count
   */
  async getFavoriteCount(serviceId) {
    const count = await Favorite.countDocuments({ serviceId });
    return count;
  },

  /**
   * Get favorites count for a user
   * @param {string} userId
   * @returns {number} Total favorites for user
   */
  async getUserFavoriteCount(userId) {
    const count = await Favorite.countDocuments({ userId });
    return count;
  },

  /**
   * Toggle favorite (add if not favorited, remove if favorited)
   * @param {string} userId
   * @param {string} serviceId
   * @returns {Object} { action: 'added'|'removed', isFavorited: boolean }
   */
  async toggleFavorite(userId, serviceId) {
    const isFavorited = await this.checkIsFavorited(userId, serviceId);

    if (isFavorited) {
      await this.removeFavorite(userId, serviceId);
      return { action: 'removed', isFavorited: false };
    } else {
      await this.addFavorite(userId, serviceId);
      return { action: 'added', isFavorited: true };
    }
  },
};

module.exports = favoriteService;
