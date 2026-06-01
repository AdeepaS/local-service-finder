const bookingService = require('../services/bookingService');
const { validateCreateBooking, validateUpdateBookingStatus } = require('../validators/bookingValidator');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private (Customer)
 */
const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, title, description, location, latitude, longitude, requestedDate, expectedDuration, notes, estimatedPrice } = req.body;
  const customerId = req.user._id;

  // Validate input
  const validation = validateCreateBooking({
    serviceId,
    title,
    requestedDate,
    location,
  });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const booking = await bookingService.createBooking({
    customerId,
    serviceId,
    title,
    description,
    location,
    latitude,
    longitude,
    requestedDate,
    expectedDuration,
    notes,
    estimatedPrice,
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
});

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:bookingId
 * @access  Private
 */
const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await bookingService.getBookingById(bookingId);

  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * @desc    Get customer's bookings
 * @route   GET /api/bookings/customer/my-bookings
 * @access  Private (Customer)
 */
const getCustomerBookings = asyncHandler(async (req, res) => {
  const customerId = req.user._id;
  const { status, page = 1, limit = 10 } = req.query;

  const result = await bookingService.getCustomerBookings(customerId, {
    status,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get provider's bookings
 * @route   GET /api/bookings/provider/my-bookings
 * @access  Private (Provider)
 */
const getProviderBookings = asyncHandler(async (req, res) => {
  const providerId = req.user._id;
  const { status, page = 1, limit = 10 } = req.query;

  const result = await bookingService.getProviderBookings(providerId, {
    status,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Accept a booking
 * @route   PUT /api/bookings/:bookingId/accept
 * @access  Private (Provider)
 */
const acceptBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { estimatedPrice } = req.body;
  const providerId = req.user._id;

  const booking = await bookingService.acceptBooking(bookingId, providerId, estimatedPrice);

  res.status(200).json({
    success: true,
    message: 'Booking accepted successfully',
    data: booking,
  });
});

/**
 * @desc    Reject a booking
 * @route   PUT /api/bookings/:bookingId/reject
 * @access  Private (Provider)
 */
const rejectBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { reason } = req.body;
  const providerId = req.user._id;

  const booking = await bookingService.rejectBooking(bookingId, providerId, reason);

  res.status(200).json({
    success: true,
    message: 'Booking rejected successfully',
    data: booking,
  });
});

/**
 * @desc    Start a booking (mark as in-progress)
 * @route   PUT /api/bookings/:bookingId/start
 * @access  Private (Provider)
 */
const startBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const providerId = req.user._id;

  const booking = await bookingService.startBooking(bookingId, providerId);

  res.status(200).json({
    success: true,
    message: 'Booking started successfully',
    data: booking,
  });
});

/**
 * @desc    Complete a booking
 * @route   PUT /api/bookings/:bookingId/complete
 * @access  Private (Provider)
 */
const completeBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { finalPrice } = req.body;
  const providerId = req.user._id;

  const booking = await bookingService.completeBooking(bookingId, providerId, finalPrice);

  res.status(200).json({
    success: true,
    message: 'Booking completed successfully',
    data: booking,
  });
});

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:bookingId/cancel
 * @access  Private
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { reason } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  const booking = await bookingService.cancelBooking(bookingId, userId, userRole, reason);

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking,
  });
});

/**
 * @desc    Get booking timeline
 * @route   GET /api/bookings/:bookingId/timeline
 * @access  Private
 */
const getBookingTimeline = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const timeline = await bookingService.getBookingTimeline(bookingId);

  res.status(200).json({
    success: true,
    data: timeline,
  });
});

module.exports = {
  createBooking,
  getBookingById,
  getCustomerBookings,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  startBooking,
  completeBooking,
  cancelBooking,
  getBookingTimeline,
};
