/**
 * Service Request Validators
 */

const validateCreateService = (data) => {
  const errors = {};
  const allowedCategories = [
    'Plumbing',
    'Electrical',
    'AC Repair',
    'Appliance Repair',
    'Carpentry',
    'Cleaning',
    'Painting',
  ];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'Service title is required and must be non-empty';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!data.category || !allowedCategories.includes(data.category)) {
    errors.category = `Category must be one of: ${allowedCategories.join(', ')}`;
  }

  if (data.description && typeof data.description !== 'string') {
    errors.description = 'Description must be a string';
  } else if (data.description && data.description.length > 5000) {
    errors.description = 'Description must be less than 5000 characters';
  }

  if (data.location && typeof data.location !== 'string') {
    errors.location = 'Location must be a string';
  }

  if (data.priceRange && typeof data.priceRange !== 'string') {
    errors.priceRange = 'Price range must be a string';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUpdateService = (data) => {
  const errors = {};
  const allowedCategories = [
    'Plumbing',
    'Electrical',
    'AC Repair',
    'Appliance Repair',
    'Carpentry',
    'Cleaning',
    'Painting',
  ];

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.title = 'Title must be a non-empty string';
    } else if (data.title.length > 200) {
      errors.title = 'Title must be less than 200 characters';
    }
  }

  if (data.category !== undefined) {
    if (!allowedCategories.includes(data.category)) {
      errors.category = `Category must be one of: ${allowedCategories.join(', ')}`;
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== 'string') {
      errors.description = 'Description must be a string';
    } else if (data.description.length > 5000) {
      errors.description = 'Description must be less than 5000 characters';
    }
  }

  if (data.location !== undefined && typeof data.location !== 'string') {
    errors.location = 'Location must be a string';
  }

  if (data.priceRange !== undefined && typeof data.priceRange !== 'string') {
    errors.priceRange = 'Price range must be a string';
  }

  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    errors.isActive = 'isActive must be a boolean';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateCreateService,
  validateUpdateService,
};
