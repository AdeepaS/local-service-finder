/**
 * Review Request Validators
 */

const validateCreateReview = (data) => {
  const errors = {};

  if (!data.serviceId || typeof data.serviceId !== 'string') {
    errors.serviceId = 'Service ID is required';
  }

  if (data.rating === undefined || data.rating === null) {
    errors.rating = 'Rating is required';
  } else {
    const numericRating = Number(data.rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
  }

  if (data.comment !== undefined && typeof data.comment !== 'string') {
    errors.comment = 'Comment must be a string';
  } else if (data.comment && data.comment.length > 1000) {
    errors.comment = 'Comment must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUpdateReview = (data) => {
  const errors = {};

  if (data.rating !== undefined) {
    const numericRating = Number(data.rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
  }

  if (data.comment !== undefined && typeof data.comment !== 'string') {
    errors.comment = 'Comment must be a string';
  } else if (data.comment && data.comment.length > 1000) {
    errors.comment = 'Comment must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateCreateReview,
  validateUpdateReview,
};
