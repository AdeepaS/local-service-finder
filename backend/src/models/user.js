const mongoose = require('mongoose');

/**
 * User Schema
 * 
 * Represents users in the system with three roles:
 * - customer: purchases services
 * - provider: offers services
 * - admin: manages the platform
 * 
 * Profile object is embedded since it's always accessed with the user
 * and is a bounded, single object per user (1:1 relationship)
 */
const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default in queries
    },

    // Role determines user type and permissions
    role: {
      type: String,
      enum: ['customer', 'provider', 'admin'],
      required: [true, 'Role is required'],
      default: 'customer',
    },

    // Contact information
    phone: {
      type: String,
      sparse: true,
    },

    // Provider-specific flag
    // Only relevant when role === 'provider'
    isApproved: {
      type: Boolean,
      default: false,
    },

    // Embedded profile object (bounded, always accessed together with user)
    profile: {
      location: String,
      profileImage: String,
      businessName: String, // For providers
      experience: Number, // Years of experience (for providers)
      description: String, // Bio/description (for providers)
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index email for faster lookups


// Index for finding providers
userSchema.index({ role: 1, isApproved: 1 });

module.exports = mongoose.model('User', userSchema);
