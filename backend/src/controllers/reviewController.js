const reviewService = require('../services/reviewService');
const emailService = require('../services/email/email.service');
const mongoose = require('mongoose');
const { validateCreateReview, validateUpdateReview } = require('../validators/reviewValidator');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/user');
const Service = require('../models/Service');
const Review = require('../models/review');

/**
 * @desc    Create a review for a service
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
const createReview = asyncHandler(async (req, res) => {
  const { serviceId, rating, comment } = req.body;
  const userId = req.user._id;

  // Validate input
  const validation = validateCreateReview({
    userId: userId.toString(),
    serviceId,
    rating,
    comment,
  });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const review = await reviewService.createReview({
    userId,
    serviceId,
    rating,
    comment,
  });

  // Send review notification to provider (with null checks)
  try {
    const customer = await User.findById(review.customer);
    const service = await Service.findById(review.service);
    
    if (customer && service && service.provider) {
      const provider = await User.findById(service.provider);
      if (provider) {
        const allReviews = await Review.find({ service: serviceId });
        const averageRating = allReviews.length > 0 
          ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
          : 0;
        const totalReviews = allReviews.length;

        emailService.sendReviewNotification({
          review: review.toObject(),
          customer: customer.toObject(),
          service: service.toObject(),
          provider: provider.toObject(),
          averageRating,
          totalReviews,
          reviewLink: `${process.env.FRONTEND_URL}/services/${serviceId}#reviews`
        }).catch(() => {
          console.warn('Review notification email failed');
        });
      }
    }
  } catch (emailError) {
    console.warn('Error sending review notification email:', emailError.message);
  }

  res.status(201).json({
    success: true,
    message: '⭐ Thank you! Your review has been posted and the provider has been notified.',
    data: review,
  });
});

/**
 * @desc    Get reviews for a service
 * @route   GET /api/reviews/service/:serviceId
 * @access  Public
 */
const getReviewsByService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const result = await reviewService.getReviewsByService(serviceId);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:reviewId
 * @access  Private (Review Owner)
 */
const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  // Validate input
  const validation = validateUpdateReview({ rating, comment });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const review = await reviewService.updateReview(reviewId, userId, { rating, comment });

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:reviewId
 * @access  Private (Review Owner)
 */
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  await reviewService.deleteReview(reviewId, userId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

module.exports = {
  createReview,
  getReviewsByService,
  updateReview,
  deleteReview,
};