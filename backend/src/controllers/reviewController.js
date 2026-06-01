const reviewService = require('../services/reviewService');
const { validateCreateReview, validateUpdateReview } = require('../validators/reviewValidator');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create a review for a service
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
const createReview = asyncHandler(async (req, res) => {
  const { serviceId, rating, comment } = req.body;
  const userId = req.user._id;

  // Validate input
  const validation = validateCreateReview({ serviceId, rating, comment });
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

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
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