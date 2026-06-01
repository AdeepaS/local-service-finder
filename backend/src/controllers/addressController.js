const addressService = require('../services/addressService');
const { validateCreateAddress, validateUpdateAddress } = require('../validators/addressValidator');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create a new address
 * @route   POST /api/addresses
 * @access  Private (Customer)
 */
const createAddress = asyncHandler(async (req, res) => {
  const { label, street, city, province, postalCode, latitude, longitude, isDefault } = req.body;
  const userId = req.user._id;

  // Validate input
  const validation = validateCreateAddress({ label, street, city, province, postalCode, latitude, longitude });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const address = await addressService.createAddress(userId, {
    label,
    street,
    city,
    province,
    postalCode,
    latitude,
    longitude,
    isDefault: isDefault || false,
  });

  res.status(201).json({
    success: true,
    message: 'Address created successfully',
    data: address,
  });
});

/**
 * @desc    Get all addresses for user
 * @route   GET /api/addresses
 * @access  Private (Customer)
 */
const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const addresses = await addressService.getAddresses(userId);

  res.status(200).json({
    success: true,
    count: addresses.length,
    data: addresses,
  });
});

/**
 * @desc    Update an address
 * @route   PUT /api/addresses/:addressId
 * @access  Private (Address Owner)
 */
const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;
  const { label, street, city, province, postalCode, latitude, longitude, isDefault } = req.body;

  // Validate input
  const validation = validateUpdateAddress({ label, street, city, province, postalCode, latitude, longitude });
  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = validation.errors;
    throw error;
  }

  const address = await addressService.updateAddress(addressId, userId, {
    label,
    street,
    city,
    province,
    postalCode,
    latitude,
    longitude,
    isDefault,
  });

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: address,
  });
});

/**
 * @desc    Delete an address
 * @route   DELETE /api/addresses/:addressId
 * @access  Private (Address Owner)
 */
const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;

  await addressService.deleteAddress(addressId, userId);

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
  });
});

/**
 * @desc    Set an address as default
 * @route   PUT /api/addresses/:addressId/set-default
 * @access  Private (Address Owner)
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;

  const address = await addressService.setDefaultAddress(addressId, userId);

  res.status(200).json({
    success: true,
    message: 'Address set as default successfully',
    data: address,
  });
});

/**
 * @desc    Get default address
 * @route   GET /api/addresses/default
 * @access  Private (Customer)
 */
const getDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const address = await addressService.getDefaultAddress(userId);

  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'No default address found',
    });
  }

  res.status(200).json({
    success: true,
    data: address,
  });
});

module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
};
