const mongoose = require('mongoose')
const asyncHandler = require('../middleware/asyncHandler')
const Review = require('../models/review')
const User = require('../models/user')
const Service = require('../models/service')

const createReview = asyncHandler(async (req, res) => {
  const { userId, serviceId, rating, comment } = req.body

  if (!userId || !serviceId) {
    const error = new Error('userId and serviceId are required')
    error.statusCode = 400
    throw error
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid userId')
    error.statusCode = 400
    throw error
  }

  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    const error = new Error('Invalid serviceId')
    error.statusCode = 400
    throw error
  }

  const [user, service, existingReview] = await Promise.all([
    User.findById(userId).select('_id role name'),
    Service.findById(serviceId).select('_id title'),
    Review.findOne({ userId, serviceId }),
  ])

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  if (user.role !== 'customer') {
    const error = new Error('Only customers can submit reviews')
    error.statusCode = 403
    throw error
  }

  if (!service) {
    const error = new Error('Service not found')
    error.statusCode = 404
    throw error
  }

  if (existingReview) {
    const error = new Error('You have already reviewed this service')
    error.statusCode = 409
    throw error
  }

  const numericRating = Number(rating)

  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    const error = new Error('rating must be between 1 and 5')
    error.statusCode = 400
    throw error
  }

  const review = await Review.create({
    userId,
    serviceId,
    rating: numericRating,
    comment,
  })

  res.status(201).json({
    success: true,
    data: review,
  })
})

const getReviewsByService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params

  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    const error = new Error('Invalid serviceId')
    error.statusCode = 400
    throw error
  }

  const service = await Service.findById(serviceId).select('_id title')

  if (!service) {
    const error = new Error('Service not found')
    error.statusCode = 404
    throw error
  }

  const reviews = await Review.find({ serviceId })
    .populate({
      path: 'userId',
      select: 'name',
    })
    .sort({ createdAt: -1 })

  const totalReviews = reviews.length
  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

  res.status(200).json({
    success: true,
    data: {
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
    },
  })
})

module.exports = {
  createReview,
  getReviewsByService,
}