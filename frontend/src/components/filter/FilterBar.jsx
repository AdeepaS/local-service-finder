import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInVariants, slideUpVariants } from '../../utils/animations';

/**
 * FilterBar Component
 * Modern horizontal filter bar with collapsible drawer for mobile
 * Replaces the old sidebar design
 */
const FilterBar = ({
  searchTerm,
  location,
  category,
  sortBy,
  onSearchChange,
  onLocationChange,
  onCategoryChange,
  onSortChange,
  onApplyFilters,
  onResetFilters,
  activeFilters,
  showAdvanced = false,
  onToggleAdvanced,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const categories = [
    'All',
    'Plumbing',
    'Electrical',
    'AC Repair',
    'Appliance Repair',
    'Carpentry',
    'Cleaning',
    'Painting',
  ];

  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  return (
    <>
      {/* Sticky Top Filter Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideUpVariants}
        className="sticky top-[72px] z-40 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile: Filter Button Only */}
          <div className="md:hidden flex items-center justify-between gap-2">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop: Full Filter Bar */}
          <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-2">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px] relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 min-w-[200px] relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={category || 'All'}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent min-w-[150px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent min-w-[160px]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Apply Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onApplyFilters}
              className="px-6 py-2.5 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Apply
            </motion.button>

            {/* Reset Button */}
            {activeFilters.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onResetFilters}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Reset
              </motion.button>
            )}
          </div>

          {/* Active Filter Chips */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {activeFilters.map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 bg-blue-50 border border-primary px-3 py-1.5 rounded-full text-sm font-medium text-primary"
                  >
                    <span>{key}: {value}</span>
                    <button
                      onClick={() => onSearchChange('')}
                      className="ml-1 hover:text-secondary"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 z-30"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-40 overflow-y-auto shadow-2xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Mobile Filter Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Service name..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => onLocationChange(e.target.value)}
                      placeholder="City or zip..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={category || 'All'}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat === 'All' ? '' : cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => onSortChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mobile Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      onApplyFilters();
                      setIsDrawerOpen(false);
                    }}
                    className="flex-1 px-4 py-3 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      onResetFilters();
                      setIsDrawerOpen(false);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterBar;
