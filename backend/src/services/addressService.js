/**
 * Address Business Logic Service
 * Handles customer address management: CRUD operations and default address handling
 */

const Address = require('../models/address');
const mongoose = require('mongoose');

const addressService = {
  /**
   * Create a new address for a customer
   * @param {string} userId
   * @param {Object} addressData - { label, street, city, province, postalCode, latitude, longitude, isDefault }
   * @returns {Object} Created address
   */
  async createAddress(userId, addressData) {
    const { label, street, city, province, postalCode, latitude, longitude, isDefault = false } = addressData;

    const address = new Address({
      userId,
      label,
      street,
      city,
      province,
      postalCode,
      latitude,
      longitude,
      isDefault,
    });

    await address.save();

    return address;
  },

  /**
   * Get all addresses for a customer
   * @param {string} userId
   * @returns {Array} Customer's addresses
   */
  async getAddresses(userId) {
    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

    return addresses;
  },

  /**
   * Get a specific address
   * @param {string} addressId
   * @param {string} userId - For ownership verification
   * @returns {Object} Address details
   */
  async getAddressById(addressId, userId) {
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      const error = new Error('Invalid address ID');
      error.statusCode = 400;
      throw error;
    }

    const address = await Address.findById(addressId);

    if (!address) {
      const error = new Error('Address not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify ownership
    if (address.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized to access this address');
      error.statusCode = 403;
      throw error;
    }

    return address;
  },

  /**
   * Update an address
   * @param {string} addressId
   * @param {string} userId - For ownership verification
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated address
   */
  async updateAddress(addressId, userId, updateData) {
    const address = await this.getAddressById(addressId, userId);

    const { label, street, city, province, postalCode, latitude, longitude, isDefault } = updateData;

    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (province !== undefined) address.province = province;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (latitude !== undefined) address.latitude = latitude;
    if (longitude !== undefined) address.longitude = longitude;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    return address;
  },

  /**
   * Delete an address
   * @param {string} addressId
   * @param {string} userId - For ownership verification
   */
  async deleteAddress(addressId, userId) {
    const address = await this.getAddressById(addressId, userId);

    // If deleting the default address, unset default
    if (address.isDefault) {
      // Set another address as default if available
      const anotherAddress = await Address.findOne({
        userId,
        _id: { $ne: addressId },
      });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    await address.deleteOne();
  },

  /**
   * Set an address as default
   * @param {string} addressId
   * @param {string} userId - For ownership verification
   * @returns {Object} Updated address
   */
  async setDefaultAddress(addressId, userId) {
    const address = await this.getAddressById(addressId, userId);

    // Unset default for other addresses
    await Address.updateMany({ userId, _id: { $ne: addressId } }, { isDefault: false });

    // Set this address as default
    address.isDefault = true;
    await address.save();

    return address;
  },

  /**
   * Get default address for a customer
   * @param {string} userId
   * @returns {Object|null} Default address or null
   */
  async getDefaultAddress(userId) {
    const address = await Address.findOne({ userId, isDefault: true });
    return address;
  },
};

module.exports = addressService;
