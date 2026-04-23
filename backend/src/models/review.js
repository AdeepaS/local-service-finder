const mongoose = require('mongoose');

/**
 * Review Schema
 * 
 * Represents customer reviews for services.
 * 
 * Uses referencing for both userId and serviceId because:
 * 1. Reviews can grow unbounded (many reviews per service)
 * 2. Reviews are often queried independently
 * 3. Users and services are accessed separately from reviews
 */
const reviewSchema = new mongoose.Schema(
  {
    // Reference to the customer who wrote the review
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Reference to the service being reviewed
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },

    // Star rating (1-5)
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },

    // Optional detailed review comment
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for finding reviews by service (important for displaying reviews on service detail page)
reviewSchema.index({ serviceId: 1 });

// Index for finding reviews by user
reviewSchema.index({ userId: 1 });

// Compound index for checking if a user already reviewed a service
reviewSchema.index({ userId: 1, serviceId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
