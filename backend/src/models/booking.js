const mongoose = require('mongoose');

/**
 * Booking Schema
 *
 * Represents a booking request from a customer for a service.
 * Tracks status, timeline, pricing, and location details.
 *
 * Status Flow: PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
 * Alternative paths: PENDING → REJECTED, ACCEPTED/IN_PROGRESS → CANCELLED
 */
const bookingSchema = new mongoose.Schema(
  {
    // References (denormalized for query efficiency)
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provider ID is required'],
    },

    // Booking Details (snapshot of service info at booking time)
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Location where service will be provided
    location: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    // Booking Status Workflow
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },

    // Pricing
    estimatedPrice: {
      type: Number,
      default: null,
    },

    finalPrice: {
      type: Number,
      default: null,
    },

    // Scheduling
    requestedDate: {
      type: Date,
      required: true,
    },

    expectedDuration: {
      type: Number, // Minutes
      default: null,
    },

    // Communication & Notes
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    cancelReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Review tracking
    isReviewed: {
      type: Boolean,
      default: false,
    },

    // Timeline Events (embedded for bounded data)
    events: [
      {
        type: {
          type: String,
          enum: ['CREATED', 'ACCEPTED', 'REJECTED', 'STARTED', 'COMPLETED', 'CANCELLED'],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        actorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        actorRole: {
          type: String,
          enum: ['customer', 'provider'],
        },
        notes: {
          type: String,
          trim: true,
        },
        _id: false, // Don't create separate _id for embedded docs
      },
    ],

    // Timestamp Fields (explicit for clarity)
    acceptedAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for common queries
bookingSchema.index({ customerId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ requestedDate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
