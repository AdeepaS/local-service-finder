/**
 * Service Business Logic Service
 * Handles service CRUD operations, filtering, and admin operations
 */

const mongoose = require('mongoose');
const Service = require('../models/Service');
const Review = require('../models/review');

/**
 * Escape special regex characters in user input
 */
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const serviceService = {
  /**
   * Get all public services with filtering and pagination
   * Only returns approved and active services
   * @param {Object} filters - { search, category, location, page, limit }
   * @returns {Object} { services, pagination }
   */
  async getPublicServices(filters = {}) {
    const {
      search, category, location,
      minPrice, maxPrice,
      minRating, verifiedOnly,
      sortBy = 'recent',
      page = 1, limit = 10,
    } = filters;

    const pageNum = Math.max(Number.parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(Number.parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    // Only show approved and active services to public users
    const query = { isActive: true, status: 'approved' };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: escapeRegExp(location), $options: 'i' };
    }

    // Numeric price filtering on the priceRange field
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.priceRange = {};
      if (minPrice !== undefined) query.priceRange.$gte = minPrice;
      if (maxPrice !== undefined) query.priceRange.$lte = maxPrice;
    }

    // Rating filter
    if (minRating !== undefined && minRating > 0) {
      query.ratingAverage = { $gte: minRating };
    }

    // Verified providers filter — join via User collection
    if (verifiedOnly) {
      const User = require('../models/user');
      const approvedProviders = await User.find(
        { role: 'provider', isApproved: true },
        { _id: 1 }
      ).lean();
      const approvedIds = approvedProviders.map((u) => u._id);
      query.providerId = { $in: approvedIds };
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (sortBy === 'rating') sort = { ratingAverage: -1 };
    else if (sortBy === 'price-low') sort = { priceRange: 1 };
    else if (sortBy === 'price-high') sort = { priceRange: -1 };

    const [total, services] = await Promise.all([
      Service.countDocuments(query),
      Service.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('providerId', 'name profile.profileImage isApproved'),
    ]);

    const pages = total === 0 ? 0 : Math.ceil(total / limitNum);

    return {
      services,
      pagination: {
        total,
        page: pageNum,
        pages,
      },
    };
  },

  /**
   * Get distinct service categories from approved services
   * @returns {string[]} Sorted list of categories
   */
  async getCategories() {
    const categories = await Service.distinct('category', {
      isActive: true,
      status: 'approved',
    });
    return categories.sort();
  },

  /**
   * Get a single service by ID with full details
   * @param {string} serviceId
   * @param {Object} user - Current user (for authorization checks)
   * @returns {Object} { service, provider, reviews }
   */
  async getServiceById(serviceId, user = null) {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid service ID');
      error.statusCode = 400;
      throw error;
    }

    const service = await Service.findById(serviceId).populate({
      path: 'providerId',
      select: 'name phone profile.location profile.profileImage',
    });

    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    // Check access: deny non-approved/non-active services unless user is owner or admin
    if (
      (!service.isActive || service.status !== 'approved') &&
      (!user || (user.role !== 'admin' && user._id.toString() !== service.providerId._id.toString()))
    ) {
      const error = new Error('Service is not available');
      error.statusCode = 403;
      throw error;
    }

    // Get reviews
    const reviews = await Review.find({ serviceId })
      .populate({
        path: 'userId',
        select: 'name',
      })
      .select('rating comment userId createdAt')
      .sort({ createdAt: -1 });

    const serviceData = service.toObject();
    const providerData = serviceData.providerId;
    delete serviceData.providerId;

    const formattedReviews = reviews.map((review) => ({
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: review.userId ? { name: review.userId.name } : null,
    }));

    return {
      service: serviceData,
      provider: providerData,
      reviews: formattedReviews,
    };
  },

  /**
   * Create a new service (provider only)
   * @param {Object} serviceData - { title, category, description, location, priceRange, images }
   * @param {string} providerId
   * @returns {Object} Created service
   */
  async createService(serviceData, providerId) {
    const { title, category, description, location, priceRange, images = [] } = serviceData;

    const service = await Service.create({
      providerId,
      title,
      category,
      description,
      location,
      priceRange,
      images,
      status: 'pending', // Requires admin approval
    });

    return service;
  },

  /**
   * Update an existing service (provider only)
   * @param {string} serviceId
   * @param {Object} updateData
   * @param {string} providerId - For ownership check
   * @returns {Object} Updated service
   */
  async updateService(serviceId, updateData, providerId) {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid service ID');
      error.statusCode = 400;
      throw error;
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (service.providerId.toString() !== providerId.toString()) {
      const error = new Error('Not authorized to update this service');
      error.statusCode = 403;
      throw error;
    }

    const { title, category, description, location, priceRange, isActive, images = [] } = updateData;

    // Update only provided fields
    if (title) service.title = title;
    if (category) service.category = category;
    if (description !== undefined) service.description = description;
    if (location !== undefined) service.location = location;
    if (priceRange !== undefined) service.priceRange = priceRange;
    if (isActive !== undefined) service.isActive = isActive;

    // Append new images if provided
    if (images.length > 0) {
      service.images = [...service.images, ...images];
    }

    await service.save();
    return service;
  },

  /**
   * Delete a service (provider only)
   * @param {string} serviceId
   * @param {string} providerId - For ownership check
   */
  async deleteService(serviceId, providerId) {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid service ID');
      error.statusCode = 400;
      throw error;
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (service.providerId.toString() !== providerId.toString()) {
      const error = new Error('Not authorized to delete this service');
      error.statusCode = 403;
      throw error;
    }

    await service.deleteOne();
    // Cascade delete all reviews for this service
    await Review.deleteMany({ serviceId });
  },

  /**
   * Get provider's own services
   * @param {string} providerId
   * @returns {Array} Services array
   */
  async getProviderServices(providerId) {
    const services = await Service.find({ providerId }).sort({ createdAt: -1 });
    return services;
  },

  /**
   * Get all services (admin only)
   * @returns {Array} All services with provider details
   */
  async getAllServices() {
    const services = await Service.find({})
      .populate('providerId', 'name email role')
      .sort({ createdAt: -1 });
    return services;
  },

  /**
   * Approve a service (admin only)
   * @param {string} serviceId
   * @returns {Object} Updated service
   */
  async approveService(serviceId) {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid service ID');
      error.statusCode = 400;
      throw error;
    }

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { status: 'approved' },
      { new: true, runValidators: true }
    );

    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    return service;
  },

  /**
   * Reject a service (admin only)
   * @param {string} serviceId
   * @returns {Object} Updated service
   */
  async rejectService(serviceId) {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      const error = new Error('Invalid service ID');
      error.statusCode = 400;
      throw error;
    }

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { status: 'rejected' },
      { new: true, runValidators: true }
    );

    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    return service;
  },
};

module.exports = serviceService;
