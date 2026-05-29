import { useState, useEffect, useRef } from 'react';
import { debounce } from '../utils/performanceHelpers';

/**
 * Custom hook for debounced values
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for managing search and filter params
 * @param {URLSearchParams} initialParams - Initial search params
 * @returns {Object} Filter state and methods
 */
export const useFilters = (initialParams) => {
  const [filters, setFilters] = useState({
    search: initialParams?.get('search') || '',
    location: initialParams?.get('location') || '',
    category: initialParams?.get('category') || '',
    minPrice: initialParams?.get('minPrice') || '',
    maxPrice: initialParams?.get('maxPrice') || '',
    sortBy: initialParams?.get('sortBy') || 'recent',
  });

  const [activeFilters, setActiveFilters] = useState(
    Object.entries(filters).filter(([_, v]) => v !== '' && v !== 'recent')
  );

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'recent',
    });
  };

  const removeFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: '',
    }));
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    removeFilter,
    activeFilters: Object.entries(filters).filter(([_, v]) => v !== '' && v !== 'recent'),
  };
};

/**
 * Custom hook for infinite scroll / pagination
 * @param {Function} fetchMore - Function to fetch more items
 * @param {number} threshold - Scroll threshold in pixels
 * @returns {Object} Infinite scroll state and ref
 */
export const useInfiniteScroll = (fetchMore, threshold = 500) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          setIsLoading(true);
          fetchMore().then(() => setIsLoading(false));
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchMore, isLoading, hasMore, threshold]);

  return {
    observerTarget,
    isLoading,
    setHasMore,
  };
};

/**
 * Custom hook for scroll position restoration
 * @returns {Object} Scroll methods
 */
export const useScrollRestoration = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    scrollToElement: (elementId) => {
      const element = document.getElementById(elementId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  };
};
