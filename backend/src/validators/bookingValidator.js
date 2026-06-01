/**
 * Booking Request Validators
 */

const validateCreateBooking = (data) => {
  const errors = {};

  if (!data.serviceId || typeof data.serviceId !== 'string') {
    errors.serviceId = 'Service ID is required';
  }

  if (data.requestedDate && !(data.requestedDate instanceof Date || typeof data.requestedDate === 'string')) {
    errors.requestedDate = 'Requested date must be a valid date';
  } else if (data.requestedDate) {
    const date = new Date(data.requestedDate);
    if (isNaN(date.getTime())) {
      errors.requestedDate = 'Requested date must be a valid date';
    } else if (date < new Date()) {
      errors.requestedDate = 'Requested date cannot be in the past';
    }
  }

  if (data.expectedDuration !== undefined) {
    const duration = Number(data.expectedDuration);
    if (!Number.isFinite(duration) || duration <= 0) {
      errors.expectedDuration = 'Expected duration must be a positive number (in minutes)';
    } else if (duration > 1440) { // More than 24 hours
      errors.expectedDuration = 'Expected duration cannot exceed 24 hours';
    }
  }

  if (data.location && typeof data.location !== 'string') {
    errors.location = 'Location must be a string';
  }

  if (data.notes && typeof data.notes !== 'string') {
    errors.notes = 'Notes must be a string';
  } else if (data.notes && data.notes.length > 1000) {
    errors.notes = 'Notes must be less than 1000 characters';
  }

  if (data.latitude !== undefined) {
    const lat = Number(data.latitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitude must be between -90 and 90';
    }
  }

  if (data.longitude !== undefined) {
    const lng = Number(data.longitude);
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      errors.longitude = 'Longitude must be between -180 and 180';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUpdateBookingStatus = (data, targetStatus) => {
  const errors = {};
  const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  if (!validStatuses.includes(targetStatus)) {
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
  }

  if (targetStatus === 'COMPLETED' && data.finalPrice !== undefined) {
    const price = Number(data.finalPrice);
    if (!Number.isFinite(price) || price < 0) {
      errors.finalPrice = 'Final price must be a non-negative number';
    }
  }

  if ((targetStatus === 'REJECTED' || targetStatus === 'CANCELLED') && data.reason) {
    if (typeof data.reason !== 'string') {
      errors.reason = 'Reason must be a string';
    } else if (data.reason.length > 500) {
      errors.reason = 'Reason must be less than 500 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateCreateBooking,
  validateUpdateBookingStatus,
};
