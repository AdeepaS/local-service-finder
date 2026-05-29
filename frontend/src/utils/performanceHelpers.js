/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll/resize events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Pixel offset from viewport edge
 * @returns {boolean} Whether element is in viewport
 */
export const isElementInViewport = (element, offset = 0) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Create intersection observer for lazy loading
 * @param {Function} callback - Called when element intersects
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver} Observer instance
 */
export const createLazyObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Optimize image source for performance
 * @param {string} url - Image URL
 * @param {Object} options - Optimization options (width, quality, etc)
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return null;
  
  // If using a CDN like Cloudinary, AWS S3, etc., add params
  const { width = 400, quality = 80 } = options;
  
  // This is a placeholder - adjust based on your image hosting
  // For now, just return the URL as-is
  return url;
};

/**
 * Prevent layout shift by setting image dimensions
 * @param {string} src - Image source
 * @returns {Promise} Resolves with {width, height}
 */
export const getImageDimensions = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
};
