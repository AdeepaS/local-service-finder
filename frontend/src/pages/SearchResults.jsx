import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchServices } from '../services/api';
import ServiceCard from '../components/ui/ServiceCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import FilterBar from '../components/filter/FilterBar';
import PageTransition from '../components/common/PageTransition';
import { useDebounce } from '../hooks/useFilters';
import { containerVariants } from '../utils/animations';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recent');

  // Debounce search term for API calls
  const debouncedSearch = useDebounce(searchTerm, 800);
  const debouncedLocation = useDebounce(location, 800);

  // Compute active filters for display
  const activeFilters = useMemo(() => {
    const active = [];
    if (searchTerm) active.push(['Search', searchTerm]);
    if (location) active.push(['Location', location]);
    if (category) active.push(['Category', category]);
    return active;
  }, [searchTerm, location, category]);

  const loadServices = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        ...Object.fromEntries([...searchParams]),
        ...params,
      };
      const data = await fetchServices(queryParams);
      setServices(data.data.services || []);
      setPagination(data.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to search services:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Load services when URL params change
  useEffect(() => {
    loadServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();

    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('search', searchTerm);
    if (location) newParams.set('location', location);
    if (category && category !== 'All') newParams.set('category', category);
    if (sortBy && sortBy !== 'recent') newParams.set('sortBy', sortBy);
    newParams.set('page', '1');

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocation('');
    setCategory('');
    setSortBy('recent');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      {/* Filter Bar - Sticky */}
      <FilterBar
        searchTerm={searchTerm}
        location={location}
        category={category}
        sortBy={sortBy}
        onSearchChange={setSearchTerm}
        onLocationChange={setLocation}
        onCategoryChange={setCategory}
        onSortChange={setSortBy}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        activeFilters={activeFilters}
      />

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {loading ? 'Searching Services...' : `${pagination.total} Services Found`}
          </h1>
          {activeFilters.length > 0 && (
            <p className="text-gray-600">
              Showing results for:{' '}
              {activeFilters.map(([key, val]) => `${key}: ${val}`).join(', ')}
            </p>
          )}
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : services.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
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
                className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 border-t border-gray-200"
              >
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
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
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                          pagination.page === pageNum
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>

                <div className="text-sm text-gray-600 font-medium">
                  Page {pagination.page} of {pagination.pages}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <EmptyState
            title="No services found"
            message="Try adjusting your filters or search terms to find what you're looking for."
            actionText="Clear Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </PageTransition>
  );
}

export default SearchResults;
