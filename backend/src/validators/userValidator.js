/**
 * User Profile Request Validators
 */

const validateUpdateProfile = (data) => {
  const errors = {};

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.name = 'Name must be a non-empty string';
    } else if (data.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }
  }

  if (data.phone !== undefined) {
    if (typeof data.phone !== 'string') {
      errors.phone = 'Phone must be a string';
    } else if (data.phone && !/^\+?[\d\s\-()]+$/.test(data.phone)) {
      errors.phone = 'Please provide a valid phone number';
    }
  }

  if (data.profile !== undefined && typeof data.profile === 'object' && data.profile !== null) {
    if (data.profile.location !== undefined && typeof data.profile.location !== 'string') {
      errors['profile.location'] = 'Location must be a string';
    }
    if (data.profile.profileImage !== undefined && typeof data.profile.profileImage !== 'string') {
      errors['profile.profileImage'] = 'Profile image must be a string (URL)';
    }
    if (data.profile.businessName !== undefined && typeof data.profile.businessName !== 'string') {
      errors['profile.businessName'] = 'Business name must be a string';
    }
    if (data.profile.experience !== undefined) {
      const exp = Number(data.profile.experience);
      if (!Number.isFinite(exp) || exp < 0) {
        errors['profile.experience'] = 'Experience must be a positive number';
      }
    }
    if (data.profile.description !== undefined && typeof data.profile.description !== 'string') {
      errors['profile.description'] = 'Description must be a string';
    } else if (data.profile.description && data.profile.description.length > 1000) {
      errors['profile.description'] = 'Description must be less than 1000 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateUpdateProfile,
};
