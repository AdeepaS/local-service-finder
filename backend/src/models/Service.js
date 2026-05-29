const mongoose = require('mongoose');

/**
 * Service Schema
 *
 * Represents individual services offered by providers.
 * Uses referencing for providerId (1 provider : many services).
 */
const serviceSchema = new mongoose.Schema(
  {
    // Reference to the provider (User with role: 'provider')
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provider ID is required'],
    },

    // Service information
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },

    // Category must be one of the allowed service types
    category: {
      type: String,
      enum: [
        'Plumbing',
        'Electrical',
        'AC Repair',
        'Appliance Repair',
        'Carpentry',
        'Cleaning',
        'Painting',
      ],
      required: [true, 'Category is required'],
    },

    // Detailed description of the service
    description: {
      type: String,
      trim: true,
    },

    // Service area/location
    location: {
      type: String,
      trim: true,
    },

    // Price range (e.g., "$50-$100", "Starting at $75")
    priceRange: {
      type: String,
      trim: true,
    },

    // Cloudinary Image URLs
    images: {
      type: [String],
      default: [],
    },

    // Admin moderation status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // Rating summary (updated when reviews are submitted)
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be 0 or above'],
      max: [5, 'Rating must be 5 or below'],
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // Provider can toggle visibility without deleting
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding services by provider
serviceSchema.index({ providerId: 1 });

// Index for filtering by category
serviceSchema.index({ category: 1 });

// Compound index for approved, active services by category
serviceSchema.index({ category: 1, status: 1, isActive: 1 });

// Text index for keyword search
serviceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
