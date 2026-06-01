/**
 * Booking Business Logic Service
 * Handles booking creation, status transitions, timeline tracking
 * Status Flow: PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
 * Alternative: PENDING → REJECTED, ACCEPTED/IN_PROGRESS → CANCELLED
 */

const Booking = require('../models/booking');
const Service = require('../models/Service');
const mongoose = require('mongoose');

const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - { customerId, serviceId, title, description, location, latitude, longitude, requestedDate, expectedDuration, notes, estimatedPrice }
   * @returns {Object} Created booking
   */
  async createBooking(bookingData) {
    const { customerId, serviceId, title, description, location, latitude, longitude, requestedDate, expectedDuration, notes, estimatedPrice } = bookingData;

    // Verify service exists and get provider ID
    const service = await Service.findById(serviceId).select('providerId');

    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    const booking = new Booking({
      customerId,
      serviceId,
      providerId: service.providerId,
      title,
      description,
      location,
      latitude,
      longitude,
      requestedDate,
      expectedDuration,
      notes,
      estimatedPrice,
      status: 'PENDING',
      events: [
        {
          type: 'CREATED',
          actorId: customerId,
          actorRole: 'customer',
          timestamp: new Date(),
        },
      ],
    });

    await booking.save();

    return booking;
  },

  /**
   * Get booking by ID
   * @param {string} bookingId
   * @returns {Object} Booking details
   */
  async getBookingById(bookingId) {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      const error = new Error('Invalid booking ID');
      error.statusCode = 400;
      throw error;
    }

    const booking = await Booking.findById(bookingId)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone profile')
      .populate('serviceId', 'title category');

    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    return booking;
  },

  /**
   * Get customer's bookings
   * @param {string} customerId
   * @param {Object} options - { status, page, limit }
   * @returns {Object} { bookings, pagination }
   */
  async getCustomerBookings(customerId, options = {}) {
    const { status, page = 1, limit = 10 } = options;

    const filter = { customerId };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter)
        .populate('serviceId', 'title category')
        .populate('providerId', 'name profile.profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const pages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      bookings,
      pagination: { total, page, pages, limit },
    };
  },

  /**
   * Get provider's bookings
   * @param {string} providerId
   * @param {Object} options - { status, page, limit }
   * @returns {Object} { bookings, pagination }
   */
  async getProviderBookings(providerId, options = {}) {
    const { status, page = 1, limit = 10 } = options;

    const filter = { providerId };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter)
        .populate('customerId', 'name email phone')
        .populate('serviceId', 'title category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const pages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      bookings,
      pagination: { total, page, pages, limit },
    };
  },

  /**
   * Update booking status with timeline event
   * @param {string} bookingId
   * @param {string} actorId
   * @param {string} actorRole
   * @param {string} newStatus
   * @param {string} notes
   * @returns {Object} Updated booking
   */
  async updateBookingStatus(bookingId, actorId, actorRole, newStatus, notes = '') {
    const booking = await this.getBookingById(bookingId);
    const currentStatus = booking.status;

    // Validate status transition
    const validTransitions = {
      PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
      ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      REJECTED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(newStatus)) {
      const error = new Error(`Cannot transition from ${currentStatus} to ${newStatus}`);
      error.statusCode = 400;
      throw error;
    }

    // Update status
    booking.status = newStatus;

    // Add timeline event
    const eventTypeMap = {
      ACCEPTED: 'ACCEPTED',
      REJECTED: 'REJECTED',
      IN_PROGRESS: 'STARTED',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
    };

    booking.events.push({
      type: eventTypeMap[newStatus],
      timestamp: new Date(),
      actorId,
      actorRole,
      notes,
    });

    // Update specific timestamps
    const timestampMap = {
      ACCEPTED: 'acceptedAt',
      IN_PROGRESS: 'startedAt',
      COMPLETED: 'completedAt',
      CANCELLED: 'cancelledAt',
    };

    if (timestampMap[newStatus]) {
      booking[timestampMap[newStatus]] = new Date();
    }

    await booking.save();

    return booking;
  },

  /**
   * Accept a booking (provider)
   * @param {string} bookingId
   * @param {string} providerId
   * @param {string} estimatedPrice
   * @returns {Object} Updated booking
   */
  async acceptBooking(bookingId, providerId, estimatedPrice = null) {
    const booking = await this.getBookingById(bookingId);

    // Verify provider ownership
    if (booking.providerId._id.toString() !== providerId.toString()) {
      const error = new Error('Not authorized to accept this booking');
      error.statusCode = 403;
      throw error;
    }

    if (booking.status !== 'PENDING') {
      const error = new Error('Only pending bookings can be accepted');
      error.statusCode = 400;
      throw error;
    }

    if (estimatedPrice !== null) {
      booking.estimatedPrice = estimatedPrice;
    }

    return this.updateBookingStatus(bookingId, providerId, 'provider', 'ACCEPTED', '');
  },

  /**
   * Reject a booking (provider)
   * @param {string} bookingId
   * @param {string} providerId
   * @param {string} reason
   * @returns {Object} Updated booking
   */
  async rejectBooking(bookingId, providerId, reason = '') {
    const booking = await this.getBookingById(bookingId);

    // Verify provider ownership
    if (booking.providerId._id.toString() !== providerId.toString()) {
      const error = new Error('Not authorized to reject this booking');
      error.statusCode = 403;
      throw error;
    }

    if (booking.status !== 'PENDING') {
      const error = new Error('Only pending bookings can be rejected');
      error.statusCode = 400;
      throw error;
    }

    return this.updateBookingStatus(bookingId, providerId, 'provider', 'REJECTED', reason);
  },

  /**
   * Start a booking (provider)
   * @param {string} bookingId
   * @param {string} providerId
   * @returns {Object} Updated booking
   */
  async startBooking(bookingId, providerId) {
    const booking = await this.getBookingById(bookingId);

    // Verify provider ownership
    if (booking.providerId._id.toString() !== providerId.toString()) {
      const error = new Error('Not authorized to start this booking');
      error.statusCode = 403;
      throw error;
    }

    if (booking.status !== 'ACCEPTED') {
      const error = new Error('Only accepted bookings can be started');
      error.statusCode = 400;
      throw error;
    }

    return this.updateBookingStatus(bookingId, providerId, 'provider', 'IN_PROGRESS', '');
  },

  /**
   * Complete a booking (provider)
   * @param {string} bookingId
   * @param {string} providerId
   * @param {number} finalPrice
   * @returns {Object} Updated booking
   */
  async completeBooking(bookingId, providerId, finalPrice = null) {
    const booking = await this.getBookingById(bookingId);

    // Verify provider ownership
    if (booking.providerId._id.toString() !== providerId.toString()) {
      const error = new Error('Not authorized to complete this booking');
      error.statusCode = 403;
      throw error;
    }

    if (booking.status !== 'IN_PROGRESS') {
      const error = new Error('Only in-progress bookings can be completed');
      error.statusCode = 400;
      throw error;
    }

    if (finalPrice !== null) {
      booking.finalPrice = finalPrice;
    }

    return this.updateBookingStatus(bookingId, providerId, 'provider', 'COMPLETED', '');
  },

  /**
   * Cancel a booking
   * @param {string} bookingId
   * @param {string} userId
   * @param {string} userRole
   * @param {string} reason
   * @returns {Object} Updated booking
   */
  async cancelBooking(bookingId, userId, userRole, reason = '') {
    const booking = await this.getBookingById(bookingId);

    // Verify ownership (customer or provider)
    const isOwner = booking.customerId._id.toString() === userId.toString() || booking.providerId._id.toString() === userId.toString();

    if (!isOwner) {
      const error = new Error('Not authorized to cancel this booking');
      error.statusCode = 403;
      throw error;
    }

    // Can only cancel if not completed or already cancelled
    if (booking.status === 'COMPLETED' || booking.status === 'REJECTED') {
      const error = new Error(`Cannot cancel a ${booking.status.toLowerCase()} booking`);
      error.statusCode = 400;
      throw error;
    }

    return this.updateBookingStatus(bookingId, userId, userRole, 'CANCELLED', reason);
  },

  /**
   * Get booking timeline
   * @param {string} bookingId
   * @returns {Array} Timeline events
   */
  async getBookingTimeline(bookingId) {
    const booking = await this.getBookingById(bookingId);
    return booking.events || [];
  },
};

module.exports = bookingService;
