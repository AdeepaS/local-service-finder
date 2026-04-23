const mongoose = require('mongoose');

/**
 * Service Schema
 * 
 * Represents individual services offered by providers.
 * 
 * Uses referencing (not embedding) for providerId because:
 * 1. One provider can have many services (unbounded array)
 * 2. Services are often queried independently of the provider
 * 3. Prevents document size issues with many services
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

    // Service status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for finding services by provider
serviceSchema.index({ providerId: 1 });

// Index for filtering by category
serviceSchema.index({ category: 1 });

// Compound index for common queries (find active services by provider in a category)
serviceSchema.index({ providerId: 1, category: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
