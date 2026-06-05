import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchServices } from '../services/api';
import axiosInstance from '../services/axiosInstance';
import ServiceCard from '../components/features/services/ServiceCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import FilterBar from '../components/filter/FilterBar';
import PageTransition from '../components/common/PageTransition';
import { useDebounce } from '../hooks/useFilters';
import { containerVariants } from '../utils/animations';

// Fallback category list used until API responds
const DEFAULT_CATEGORIES = [
  'AC Repair', 'Appliance Repair', 'Carpentry',
  'Cleaning', 'Electrical', 'Painting', 'Plumbing',
];

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Filter State ────────────────────────────────────────────────────────
  const [searchTerm,    setSearchTerm]    = useState(searchParams.get('search')      || '');
  const [location,      setLocation]      = useState(searchParams.get('location')    || '');
  const [category,      setCategory]      = useState(searchParams.get('category')    || '');
  const [minPrice,      setMinPrice]      = useState(searchParams.get('minPrice')    || '');
  const [maxPrice,      setMaxPrice]      = useState(searchParams.get('maxPrice')    || '');
  const [minRating,     setMinRating]     = useState(searchParams.get('minRating')   || '');
  const [verifiedOnly,  setVerifiedOnly]  = useState(searchParams.get('verifiedOnly') === 'true');
  const [sortBy,        setSortBy]        = useState(searchParams.get('sortBy')      || 'recent');

  // ── Data State ──────────────────────────────────────────────────────────
  const [services,    setServices]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [pagination,  setPagination]  = useState({ page: 1, pages: 1, total: 0 });
  const [categories,  setCategories]  = useState(DEFAULT_CATEGORIES);

  // ── Debounced inputs (avoid firing API on every keystroke) ───────────────
  const debouncedSearch   = useDebounce(searchTerm, 600);
  const debouncedLocation = useDebounce(location,   600);

  // ── Fetch dynamic categories from backend ────────────────────────────────
  useEffect(() => {
    axiosInstance.get('/services/categories')
      .then(res => { if (res.data?.data?.length) setCategories(res.data.data); })
      .catch(() => {/* keep defaults */});
  }, []);

  // ── Computed active filters for chip display ─────────────────────────────
  const activeFilters = useMemo(() => {
    const active = [];
    if (searchTerm)   active.push(['search',      searchTerm]);
    if (location)     active.push(['location',    location]);
    if (category)     active.push(['category',    category]);
    if (minPrice)     active.push(['minPrice',    minPrice]);
    if (maxPrice)     active.push(['maxPrice',    maxPrice]);
    if (minRating)    active.push(['minRating',   minRating]);
    if (verifiedOnly) active.push(['verifiedOnly', true]);
    if (sortBy && sortBy !== 'recent') active.push(['sortBy', sortBy]);
    return active;
  }, [searchTerm, location, category, minPrice, maxPrice, minRating, verifiedOnly, sortBy]);

  // ── Core data loader ─────────────────────────────────────────────────────
  const loadServices = useCallback(async (overrideParams) => {
    setLoading(true);
    try {
      const qp = overrideParams
        ? Object.fromEntries([...overrideParams])
        : Object.fromEntries([...searchParams]);
      const data = await fetchServices(qp);
      setServices(data.data.services || []);
      setPagination(data.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Re-fetch whenever URL params change
  useEffect(() => {
    loadServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Build URLSearchParams from current filter state ───────────────────────
  const buildParams = useCallback(() => {
    const p = new URLSearchParams();
    if (searchTerm)   p.set('search',      searchTerm);
    if (location)     p.set('location',    location);
    if (category)     p.set('category',    category);
    if (minPrice)     p.set('minPrice',    minPrice);
    if (maxPrice)     p.set('maxPrice',    maxPrice);
    if (minRating)    p.set('minRating',   minRating);
    if (verifiedOnly) p.set('verifiedOnly','true');
    if (sortBy && sortBy !== 'recent') p.set('sortBy', sortBy);
    p.set('page', '1');
    return p;
  }, [searchTerm, location, category, minPrice, maxPrice, minRating, verifiedOnly, sortBy]);

  const handleApplyFilters = useCallback((e) => {
    if (e) e.preventDefault();
    setSearchParams(buildParams());
  }, [buildParams, setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setLocation('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setVerifiedOnly(false);
    setSortBy('recent');
    setSearchParams({});
  }, [setSearchParams]);

  const handleRemoveFilter = useCallback((key) => {
    const updaters = {
      search:      () => setSearchTerm(''),
      location:    () => setLocation(''),
      category:    () => setCategory(''),
      minPrice:    () => setMinPrice(''),
      maxPrice:    () => setMaxPrice(''),
      minRating:   () => setMinRating(''),
      verifiedOnly:() => setVerifiedOnly(false),
      sortBy:      () => setSortBy('recent'),
    };
    updaters[key]?.();
    // Rebuild params without that key
    const p = buildParams();
    p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  }, [buildParams, setSearchParams]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    const p = new URLSearchParams(searchParams);
    p.set('page', newPage);
    setSearchParams(p);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }, [pagination.pages, searchParams, setSearchParams]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <PageTransition>
      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        location={location}
        category={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
        minRating={minRating}
        verifiedOnly={verifiedOnly}
        sortBy={sortBy}
        onSearchChange={setSearchTerm}
        onLocationChange={setLocation}
        onCategoryChange={setCategory}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onMinRatingChange={setMinRating}
        onVerifiedOnlyChange={setVerifiedOnly}
        onSortChange={setSortBy}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        onRemoveFilter={handleRemoveFilter}
        activeFilters={activeFilters}
        categories={categories}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {loading ? (
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {pagination.total > 0
                ? `${pagination.total} Service${pagination.total === 1 ? '' : 's'} Found`
                : 'No Services Found'}
            </h1>
          )}

          {/* Active filter summary text */}
          <AnimatePresence>
            {activeFilters.length > 0 && !loading && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1 text-sm text-gray-500"
              >
                Filters applied:{' '}
                <span className="font-medium text-primary">
                  {activeFilters
                    .map(([k, v]) => {
                      if (k === 'verifiedOnly') return 'Verified Only';
                      if (k === 'minRating') return `${v}★+`;
                      if (k === 'minPrice') return `From $${v}`;
                      if (k === 'maxPrice') return `Up to $${v}`;
                      return v;
                    })
                    .join(' • ')}
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : services.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-8 border-t border-gray-200"
              >
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(5, pagination.pages) }).map((_, idx) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = idx + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = idx + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + idx;
                    } else {
                      pageNum = pagination.page - 2 + idx;
                    }

                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl font-semibold text-sm transition-all ${
                          pagination.page === pageNum
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Next →
                </button>

                <span className="text-sm text-gray-500 font-medium">
                  Page {pagination.page} of {pagination.pages}
                </span>
              </motion.div>
            )}
          </>
        ) : (
          <EmptyState
            title="No services found"
            message="Try adjusting your filters or search terms. You can also clear all filters to see all available services."
            actionText="Clear All Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </PageTransition>
  );
}

export default SearchResults;
