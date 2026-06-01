/**
 * Address Request Validators
 */

const validateCreateAddress = (data) => {
  const errors = {};

  if (!data.label || typeof data.label !== 'string' || data.label.trim().length === 0) {
    errors.label = 'Label is required (e.g., "Home", "Work")';
  } else if (data.label.length > 50) {
    errors.label = 'Label must be less than 50 characters';
  }

  if (!data.street || typeof data.street !== 'string' || data.street.trim().length === 0) {
    errors.street = 'Street address is required';
  } else if (data.street.length > 200) {
    errors.street = 'Street must be less than 200 characters';
  }

  if (!data.city || typeof data.city !== 'string' || data.city.trim().length === 0) {
    errors.city = 'City is required';
  } else if (data.city.length > 100) {
    errors.city = 'City must be less than 100 characters';
  }

  if (!data.province || typeof data.province !== 'string' || data.province.trim().length === 0) {
    errors.province = 'Province/State is required';
  } else if (data.province.length > 100) {
    errors.province = 'Province must be less than 100 characters';
  }

  if (!data.postalCode || typeof data.postalCode !== 'string' || data.postalCode.trim().length === 0) {
    errors.postalCode = 'Postal code is required';
  } else if (data.postalCode.length > 20) {
    errors.postalCode = 'Postal code must be less than 20 characters';
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

  if (data.isDefault !== undefined && typeof data.isDefault !== 'boolean') {
    errors.isDefault = 'isDefault must be a boolean';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUpdateAddress = (data) => {
  const errors = {};

  if (data.label !== undefined) {
    if (typeof data.label !== 'string' || data.label.trim().length === 0) {
      errors.label = 'Label must be a non-empty string';
    } else if (data.label.length > 50) {
      errors.label = 'Label must be less than 50 characters';
    }
  }

  if (data.street !== undefined) {
    if (typeof data.street !== 'string' || data.street.trim().length === 0) {
      errors.street = 'Street address must be non-empty';
    } else if (data.street.length > 200) {
      errors.street = 'Street must be less than 200 characters';
    }
  }

  if (data.city !== undefined) {
    if (typeof data.city !== 'string' || data.city.trim().length === 0) {
      errors.city = 'City must be non-empty';
    } else if (data.city.length > 100) {
      errors.city = 'City must be less than 100 characters';
    }
  }

  if (data.province !== undefined) {
    if (typeof data.province !== 'string' || data.province.trim().length === 0) {
      errors.province = 'Province must be non-empty';
    } else if (data.province.length > 100) {
      errors.province = 'Province must be less than 100 characters';
    }
  }

  if (data.postalCode !== undefined) {
    if (typeof data.postalCode !== 'string' || data.postalCode.trim().length === 0) {
      errors.postalCode = 'Postal code must be non-empty';
    } else if (data.postalCode.length > 20) {
      errors.postalCode = 'Postal code must be less than 20 characters';
    }
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

  if (data.isDefault !== undefined && typeof data.isDefault !== 'boolean') {
    errors.isDefault = 'isDefault must be a boolean';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateCreateAddress,
  validateUpdateAddress,
};
