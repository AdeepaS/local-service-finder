const mongoose = require('mongoose')
const Service = require('../models/Service')
const Review = require('../models/review')
const asyncHandler = require('../middleware/asyncHandler')

// Escape user input before building a regex.
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Get PUBLIC services (only approved & active)
const getServices = asyncHandler(async (req, res) => {
  const { search, category, location } = req.query

  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)
  const limit = Math.max(Number.parseInt(req.query.limit, 10) || 10, 1)
  const skip = (page - 1) * limit

  // Public users only see approved and active services
  const filter = { isActive: true, status: 'approved' }

  if (search) {
    filter.$text = { $search: search }
  }

  if (category) {
    filter.category = category
  }

  if (location) {
    filter.location = { $regex: escapeRegExp(location), $options: 'i' }
  }

  const [total, services] = await Promise.all([
    Service.countDocuments(filter),
    Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('providerId', 'name profile.profileImage'),
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid service ID')
    error.statusCode = 400
    throw error
  }

  const service = await Service.findById(id).populate({
    path: 'providerId',
    select: 'name phone profile.location profile.profileImage',
  })

  if (!service) {
    const error = new Error('Service not found')
    error.statusCode = 404
    throw error
  }

  // If a customer tries to view a non-approved/non-active service, deny them unless they are the owner or admin
  if ((!service.isActive || service.status !== 'approved') && (!req.user || (req.user.role !== 'admin' && req.user._id.toString() !== service.providerId._id.toString()))) {
    const error = new Error('Service is not available')
    error.statusCode = 403
    throw error
  }

  const reviews = await Review.find({ serviceId: id })
    .populate({
      path: 'userId',
      select: 'name',
    })
    .select('rating comment userId createdAt')
    .sort({ createdAt: -1 })

  const serviceData = service.toObject()
  const providerData = serviceData.providerId

  delete serviceData.providerId

  const formattedReviews = reviews.map((review) => ({
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
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

// Create a new service (Provider)
const createService = asyncHandler(async (req, res) => {
  const { title, category, description, location, priceRange } = req.body
  const providerId = req.user._id;

  if (!title || !category) {
    const error = new Error('Title and category are required')
    error.statusCode = 400
    throw error
  }

  const allowedCategories = Service.schema.path('category').enumValues
  if (!allowedCategories.includes(category)) {
    const error = new Error(`Category must be one of: ${allowedCategories.join(', ')}`)
    error.statusCode = 400
    throw error
  }

  const images = req.files ? req.files.map(file => file.path) : [];

  const service = await Service.create({
    providerId,
    title,
    category,
    description,
    location,
    priceRange,
    images,
    status: 'pending' // Requires admin approval
  })

  res.status(201).json({
    success: true,
    data: service,
  })
})

// Update a service (Provider)
const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, category, description, location, priceRange, isActive } = req.body;
  const providerId = req.user._id;

  const service = await Service.findById(id);

  if (!service) {
    const error = new Error('Service not found')
    error.statusCode = 404
    throw error
  }

  // Enforce ownership
  if (service.providerId.toString() !== providerId.toString()) {
    const error = new Error('Not authorized to update this service')
    error.statusCode = 403
    throw error
  }

  // Update fields
  if (title) service.title = title;
  if (category) service.category = category;
  if (description) service.description = description;
  if (location) service.location = location;
  if (priceRange) service.priceRange = priceRange;
  if (isActive !== undefined) service.isActive = isActive;

  // Append new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => file.path);
    service.images = [...service.images, ...newImages];
  }

  await service.save();

  res.status(200).json({
    success: true,
    data: service
  })
})

// Delete a service (Provider)
const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const providerId = req.user._id;

  const service = await Service.findById(id);

  if (!service) {
    const error = new Error('Service not found')
    error.statusCode = 404
    throw error
  }

  // Enforce ownership
  if (service.providerId.toString() !== providerId.toString()) {
    const error = new Error('Not authorized to delete this service')
    error.statusCode = 403
    throw error
  }

  await service.deleteOne();
  await Review.deleteMany({ serviceId: id }); // Cascade delete reviews

  res.status(200).json({
    success: true,
    message: 'Service removed successfully'
  })
})

// Get Provider's own services
const getMyServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ providerId: req.user._id }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// Admin: Get all services
const getAllAdminServices = asyncHandler(async (req, res) => {
  const services = await Service.find({}).populate('providerId', 'name email').sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// Admin: Approve service
const approveService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findByIdAndUpdate(id, { status: 'approved' }, { new: true, runValidators: true });

  if (!service) {
    const error = new Error('Service not found')
    error.statusCode = 404
    throw error
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

// Admin: Reject service
const rejectService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findByIdAndUpdate(id, { status: 'rejected' }, { new: true, runValidators: true });

  if (!service) {
    const error = new Error('Service not found')
    error.statusCode = 404
    throw error
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
  getAllAdminServices,
  approveService,
  rejectService
}