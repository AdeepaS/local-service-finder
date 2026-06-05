const serviceService = require('../services/serviceService');
const { validateCreateService, validateUpdateService } = require('../validators/serviceValidator');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get public services (approved only)
 * @route   GET /api/services
 * @access  Public
 */
const getServices = asyncHandler(async (req, res) => {
  const {
    search, category, location,
    minPrice, maxPrice,
    minRating, verifiedOnly,
    sortBy,
    page = 1, limit = 10,
  } = req.query;

  const result = await serviceService.getPublicServices({
    search,
    category,
    location,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    verifiedOnly: verifiedOnly === 'true',
    sortBy,
    page: Math.max(parseInt(page, 10) || 1, 1),
    limit: Math.max(parseInt(limit, 10) || 10, 1),
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get all distinct service categories
 * @route   GET /api/services/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await serviceService.getCategories();
  res.status(200).json({ success: true, data: categories });
});

/**
 * @desc    Get service by ID with provider details and reviews
 * @route   GET /api/services/:id
 * @access  Public/Private
 */
const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const userRole = req.user?.role;

  const result = await serviceService.getServiceById(id, userId, userRole);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Create a new service
 * @route   POST /api/services
 * @access  Private (Provider)
 */
const createService = asyncHandler(async (req, res) => {
  const { title, category, description, location, priceRange } = req.body;
  const providerId = req.user._id;
  const images = req.files ? req.files.map(file => file.path) : [];

  // Validate input
  const validation = validateCreateService({ title, category, description, location, priceRange });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const service = await serviceService.createService({
    providerId,
    title,
    category,
    description,
    location,
    priceRange,
    images,
  });

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service,
  });
});

/**
 * @desc    Update a service
 * @route   PUT /api/services/:id
 * @access  Private (Provider)
 */
const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, category, description, location, priceRange, isActive } = req.body;
  const providerId = req.user._id;
  const newImages = req.files ? req.files.map(file => file.path) : [];

  // Validate input
  const validation = validateUpdateService({ title, category, description, location, priceRange, isActive });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const service = await serviceService.updateService(id, providerId, {
    title,
    category,
    description,
    location,
    priceRange,
    isActive,
    newImages,
  });

  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: service,
  });
});

/**
 * @desc    Delete a service
 * @route   DELETE /api/services/:id
 * @access  Private (Provider)
 */
const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const providerId = req.user._id;

  await serviceService.deleteService(id, providerId);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
  });
});

/**
 * @desc    Get provider's own services
 * @route   GET /api/services/provider/my-services
 * @access  Private (Provider)
 */
const getMyServices = asyncHandler(async (req, res) => {
  const providerId = req.user._id;

  const services = await serviceService.getProviderServices(providerId);

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

/**
 * @desc    Get all services (admin)
 * @route   GET /api/services/admin/all
 * @access  Private (Admin)
 */
const getAllAdminServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getAllServices();

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

/**
 * @desc    Approve a service (admin)
 * @route   PUT /api/services/admin/:id/approve
 * @access  Private (Admin)
 */
const approveService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await serviceService.approveService(id);

  res.status(200).json({
    success: true,
    message: 'Service approved successfully',
    data: service,
  });
});

/**
 * @desc    Reject a service (admin)
 * @route   PUT /api/services/admin/:id/reject
 * @access  Private (Admin)
 */
const rejectService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const service = await serviceService.rejectService(id, reason);

  res.status(200).json({
    success: true,
    message: 'Service rejected successfully',
    data: service,
  });
});

module.exports = {
  getServices,
  getCategories,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
  getAllAdminServices,
  approveService,
  rejectService,
};
