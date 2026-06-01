const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// Customer endpoints - customer's own bookings
router.get('/customer/my-bookings', bookingController.getCustomerBookings);

// Provider endpoints - provider's own bookings
router.get('/provider/my-bookings', bookingController.getProviderBookings);

// Booking creation and retrieval
router.post('/', bookingController.createBooking);
router.get('/:bookingId/timeline', bookingController.getBookingTimeline);
router.get('/:bookingId', bookingController.getBookingById);

// Status transition endpoints
router.put('/:bookingId/accept', bookingController.acceptBooking);
router.put('/:bookingId/reject', bookingController.rejectBooking);
router.put('/:bookingId/start', bookingController.startBooking);
router.put('/:bookingId/complete', bookingController.completeBooking);
router.put('/:bookingId/cancel', bookingController.cancelBooking);

module.exports = router;
