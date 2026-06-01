/**
 * Review Business Logic Service
 * Handles review creation, retrieval, and deletion
 */

const mongoose = require('mongoose');
const Review = require('../models/review');
const Service = require('../models/Service');
const User = require('../models/user');

const reviewService = {
  /**
   * Create a new review
   * Only customers can create reviews, and only one review per service
   * @param {Object} reviewData - { userId, serviceId, rating, comment }
   * @returns {Object} Created review
   */
  async createReview(reviewData) {
    const { userId, serviceId, rating, comment } = reviewData;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error('Invalid userId');
      error.statusCode = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid serviceId');
      error.statusCode = 400;
      throw error;
    }

    // Check user exists and is customer
    const user = await User.findById(userId).select('_id role name');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role !== 'customer') {
      const error = new Error('Only customers can submit reviews');
      error.statusCode = 403;
      throw error;
    }

    // Check service exists
    const service = await Service.findById(serviceId).select('_id title');
    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    // Check user hasn't already reviewed this service
    const existingReview = await Review.findOne({ userId, serviceId });
    if (existingReview) {
      const error = new Error('You have already reviewed this service');
      error.statusCode = 409;
      throw error;
    }

    // Validate rating
    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      const error = new Error('Rating must be between 1 and 5');
      error.statusCode = 400;
      throw error;
    }

    // Create review
    const review = await Review.create({
      userId,
      serviceId,
      rating: numericRating,
      comment: comment || '',
    });

    // Update service rating statistics
    await this.updateServiceRating(serviceId);

    return review;
  },

  /**
   * Get all reviews for a service with formatting
   * @param {string} serviceId
   * @returns {Object} { service, totalReviews, averageRating, reviews }
   */
  async getReviewsByService(serviceId) {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid serviceId');
      error.statusCode = 400;
      throw error;
    }

    const service = await Service.findById(serviceId).select('_id title');
    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    const reviews = await Review.find({ serviceId })
      .populate({
        path: 'userId',
        select: 'name',
      })
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    return {
      service: {
        id: service._id,
        title: service.title,
      },
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviews: reviews.map((review) => ({
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        user: review.userId ? { name: review.userId.name } : null,
        createdAt: review.createdAt,
      })),
    };
  },

  /**
   * Update an existing review
   * Only the review author can update
   * @param {string} reviewId
   * @param {Object} updateData - { rating, comment }
   * @param {string} userId - For authorization
   * @returns {Object} Updated review
   */
  async updateReview(reviewId, updateData, userId) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      const error = new Error('Invalid review ID');
      error.statusCode = 400;
      throw error;
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (review.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized to update this review');
      error.statusCode = 403;
      throw error;
    }

    const { rating, comment } = updateData;

    // Update fields if provided
    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
        const error = new Error('Rating must be between 1 and 5');
        error.statusCode = 400;
        throw error;
      }
      review.rating = numericRating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    // Update service rating
    await this.updateServiceRating(review.serviceId);

    return review;
  },

  /**
   * Delete a review
   * Only the review author can delete
   * @param {string} reviewId
   * @param {string} userId - For authorization
   */
  async deleteReview(reviewId, userId) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      const error = new Error('Invalid review ID');
      error.statusCode = 400;
      throw error;
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (review.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized to delete this review');
      error.statusCode = 403;
      throw error;
    }

    const serviceId = review.serviceId;

    await review.deleteOne();

    // Update service rating
    await this.updateServiceRating(serviceId);
  },

  /**
   * Update service's rating statistics
   * Calculates and stores average rating and total review count
   * @param {string} serviceId
   */
  async updateServiceRating(serviceId) {
    const reviews = await Review.find({ serviceId });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    await Service.findByIdAndUpdate(
      serviceId,
      {
        ratingAverage: parseFloat(averageRating.toFixed(1)),
        totalReviews,
      },
      { new: true }
    );
  },
};

module.exports = reviewService;
