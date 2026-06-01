const mongoose = require('mongoose');

/**
 * Favorite Schema
 *
 * Represents a customer's saved/bookmarked services.
 * Each user can favorite multiple services, and each service can be favorited by multiple users.
 * Uses a compound unique index to prevent duplicate entries.
 */
const favoriteSchema = new mongoose.Schema(
  {
    // Reference to the customer
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Reference to the service
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound unique index to prevent duplicate favorites for the same user-service pair
favoriteSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

// Index for efficient querying of user's favorites
favoriteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
