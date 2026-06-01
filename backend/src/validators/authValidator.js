/**
 * Authentication Request Validators
 */

const validateRegister = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Name is required and must be a non-empty string';
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please provide a valid email';
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  const validRoles = ['customer', 'provider', 'admin'];
  if (data.role && !validRoles.includes(data.role)) {
    errors.role = `Role must be one of: ${validRoles.join(', ')}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please provide a valid email';
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateChangePassword = (data) => {
  const errors = {};

  if (!data.currentPassword || typeof data.currentPassword !== 'string') {
    errors.currentPassword = 'Current password is required';
  }

  if (!data.newPassword || typeof data.newPassword !== 'string') {
    errors.newPassword = 'New password is required';
  } else if (data.newPassword.length < 6) {
    errors.newPassword = 'New password must be at least 6 characters';
  }

  if (!data.confirmPassword || data.confirmPassword !== data.newPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (data.currentPassword === data.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Helper function to validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
};
