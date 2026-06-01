const mongoose = require('mongoose');

/**
 * Address Schema
 *
 * Represents customer addresses for service bookings.
 * Customers can have multiple addresses, with one marked as default.
 * Includes geolocation data for map integration.
 */
const addressSchema = new mongoose.Schema(
  {
    // Reference to the customer
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Address Label (e.g., "Home", "Work", "Mother's House")
    label: {
      type: String,
      required: [true, 'Address label is required'],
      trim: true,
      maxlength: [50, 'Label must be less than 50 characters'],
    },

    // Street Address
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street must be less than 200 characters'],
    },

    // City
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City must be less than 100 characters'],
    },

    // Province/State
    province: {
      type: String,
      required: [true, 'Province/State is required'],
      trim: true,
      maxlength: [100, 'Province must be less than 100 characters'],
    },

    // Postal Code/ZIP Code
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
      maxlength: [20, 'Postal code must be less than 20 characters'],
    },

    // Geolocation (latitude, longitude) for map integration
    latitude: {
      type: Number,
      default: null,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },

    longitude: {
      type: Number,
      default: null,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },

    // Mark as default address
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for efficient querying
addressSchema.index({ userId: 1 });
addressSchema.index({ userId: 1, isDefault: 1 });

// Pre-save hook: Ensure only one default address per user
addressSchema.pre('save', async function (next) {
  if (this.isDefault) {
    // If marking as default, unset default for other addresses of this user
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('Address', addressSchema);
