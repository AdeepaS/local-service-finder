const mongoose = require('mongoose')
const Service = require('../models/service')
const Review = require('../models/review')
const asyncHandler = require('../middleware/asyncHandler')

// Escape user input before building a regex.
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Get services with optional search, filters, and pagination.
const getServices = asyncHandler(async (req, res) => {
  const { search, category, location } = req.query

  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)
  const limit = Math.max(Number.parseInt(req.query.limit, 10) || 10, 1)
  const skip = (page - 1) * limit

  // Build the query dynamically so only provided filters are applied.
  const filter = { isActive: true }

  if (search) {
    filter.title = { $regex: escapeRegExp(search), $options: 'i' }
  }

  if (category) {
    filter.category = category
  }

  if (location) {
    filter.location = { $regex: escapeRegExp(location), $options: 'i' }
  }

  // Count first so pagination metadata reflects the filtered dataset.
  const [total, services] = await Promise.all([
    Service.countDocuments(filter),
    Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ])

  const pages = total === 0 ? 0 : Math.ceil(total / limit)

  res.status(200).json({
    success: true,
    data: {
      services,
      pagination: {
        total,
        page,
        pages,
      },
    },
  })
})

// Get a service by ID with provider details and related reviews
const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params

  // Reject malformed MongoDB ObjectIds before querying the database.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid service ID')
    error.statusCode = 400
    throw error
  }

  const service = await Service.findById(id).populate({
    path: 'providerId',
    select: 'name phone profile.location',
  })

  if (!service) {
    const error = new Error('Service not found')
    error.statusCode = 404
    throw error
  }

  // Pull related reviews and include the reviewer name.
  const reviews = await Review.find({ serviceId: id })
    .populate({
      path: 'userId',
      select: 'name',
    })
    .select('rating comment userId')
    .sort({ createdAt: -1 })

  const serviceData = service.toObject()
  const providerData = serviceData.providerId

  // Keep the service payload focused on service fields and expose provider separately.
  delete serviceData.providerId

  const formattedReviews = reviews.map((review) => ({
    rating: review.rating,
    comment: review.comment,
    user: review.userId ? { name: review.userId.name } : null,
  }))

  res.status(200).json({
    success: true,
    data: {
      service: serviceData,
      provider: providerData,
      reviews: formattedReviews,
    },
  })
})

// Create a new service
const createService = asyncHandler(async (req, res) => {
  const { providerId, title, category, description, location, priceRange } = req.body

  if (!title || !category) {
    const error = new Error('title and category are required')
    error.statusCode = 400
    throw error
  }

  const allowedCategories = Service.schema.path('category').enumValues
  if (!allowedCategories.includes(category)) {
    const error = new Error(`category must be one of: ${allowedCategories.join(', ')}`)
    error.statusCode = 400
    throw error
  }

  const service = await Service.create({
    providerId,
    title,
    category,
    description,
    location,
    priceRange,
  })

  res.status(201).json({
    success: true,
    data: service,
  })
})

module.exports = {
  getServices,
  getServiceById,
  createService,
}