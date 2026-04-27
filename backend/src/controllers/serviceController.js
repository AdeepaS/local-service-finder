const Service = require('../models/service')
const asyncHandler = require('../middleware/asyncHandler')

// Get all services
const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    data: services,
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
  getAllServices,
  createService,
}