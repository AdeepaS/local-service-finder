import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Tag, DollarSign, Star, ShieldCheck,
  SlidersHorizontal, X, ChevronDown, RotateCcw
} from 'lucide-react';
import { slideUpVariants } from '../../utils/animations';

const CATEGORIES = [
  'AC Repair', 'Appliance Repair', 'Carpentry',
  'Cleaning', 'Electrical', 'Painting', 'Plumbing',
];

const SORT_OPTIONS = [
  { value: 'recent',     label: 'Recently Added' },
  { value: 'rating',     label: 'Highest Rated'  },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
];

const RATING_OPTIONS = [
  { value: '',  label: 'All Ratings' },
  { value: '3', label: '3★ & Above'  },
  { value: '4', label: '4★ & Above'  },
];

/** Human-readable label for an active filter chip */
const filterLabel = (key, value) => {
  const labels = {
    search:      `"${value}"`,
    location:    value,
    category:    value,
    minPrice:    `From $${value}`,
    maxPrice:    `Up to $${value}`,
    minRating:   `${value}★+`,
    verifiedOnly:'Verified Only',
    sortBy:      SORT_OPTIONS.find(o => o.value === value)?.label,
  };
  return labels[key] ?? value;
};

/**
 * FilterBar Component
 * Modern horizontal filter bar with full-featured mobile drawer.
 * Supports: search, location, category, price range, rating, verified, sort.
 */
const FilterBar = ({
  searchTerm,
  location,
  category,
  minPrice,
  maxPrice,
  minRating,
  verifiedOnly,
  sortBy,
  onSearchChange,
  onLocationChange,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMinRatingChange,
  onVerifiedOnlyChange,
  onSortChange,
  onApplyFilters,
  onResetFilters,
  activeFilters = [],
  onRemoveFilter,
  categories = CATEGORIES,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const handleApply = () => {
    onApplyFilters();
    closeDrawer();
  };

  const handleReset = () => {
    onResetFilters();
    closeDrawer();
  };

  // ── Desktop filter pill helpers ────────────────────────────────────────────

  const inputBase =
    'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary ' +
    'placeholder-gray-400 transition-all duration-200';

  const labelBase = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

  return (
    <>
      {/* ─── Sticky Top Filter Bar ───────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideUpVariants}
        className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">

          {/* ── Mobile Row ─────────────────────────────────────────────────── */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Mobile filter trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Mobile sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => onSortChange(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* ── Desktop Row ─────────────────────────────────────────────────── */}
          <div className="hidden md:block space-y-3">
            {/* Search bar row */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services by name or keyword..."
                  value={searchTerm}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => onSortChange(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white min-w-[170px]"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>

              {/* Apply */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onApplyFilters}
                className="px-5 py-2.5 bg-primary hover:bg-secondary text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shadow-sm"
              >
                Apply Filters
              </motion.button>

              {activeFilters.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </motion.button>
              )}
            </div>

            {/* Filter chips row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Location */}
              <div className="relative min-w-[160px]">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={e => onLocationChange(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {/* Category */}
              <div className="relative min-w-[160px]">
                <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select
                  value={category}
                  onChange={e => onCategoryChange(e.target.value)}
                  className="w-full appearance-none pl-8 pr-7 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white text-gray-700"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Price range */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Min $"
                  value={minPrice}
                  min={0}
                  onChange={e => onMinPriceChange(e.target.value)}
                  className="w-20 text-sm bg-transparent focus:outline-none placeholder-gray-400"
                />
                <span className="text-gray-300">–</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={maxPrice}
                  min={0}
                  onChange={e => onMaxPriceChange(e.target.value)}
                  className="w-20 text-sm bg-transparent focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Rating */}
              <div className="relative min-w-[140px]">
                <Star className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-yellow-400 pointer-events-none" />
                <select
                  value={minRating}
                  onChange={e => onMinRatingChange(e.target.value)}
                  className="w-full appearance-none pl-8 pr-7 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white text-gray-700"
                >
                  {RATING_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Verified toggle */}
              <button
                onClick={() => onVerifiedOnlyChange(!verifiedOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  verifiedOnly
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Only
              </button>
            </div>
          </div>

          {/* ── Active Filter Chips ─────────────────────────────────────────── */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2.5 flex flex-wrap gap-2"
              >
                <span className="text-xs text-gray-500 self-center font-medium">Active:</span>
                {activeFilters.map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full text-xs font-semibold"
                  >
                    <span>{filterLabel(key, value)}</span>
                    {onRemoveFilter && (
                      <button
                        onClick={() => onRemoveFilter(key)}
                        className="hover:text-secondary ml-0.5"
                        aria-label={`Remove ${key} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                ))}
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-red-500 font-medium underline-offset-2 hover:underline transition-colors self-center"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── Mobile Filter Drawer ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="md:hidden fixed right-0 top-0 bottom-0 w-[90vw] max-w-sm bg-white z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  {activeFilters.length > 0 && (
                    <span className="bg-primary text-white rounded-full px-2 py-0.5 text-xs font-bold">
                      {activeFilters.length}
                    </span>
                  )}
                </div>
                <button onClick={closeDrawer} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 p-5 space-y-5 overflow-y-auto">

                {/* Search */}
                <div>
                  <label className={labelBase}>Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => onSearchChange(e.target.value)}
                      placeholder="Service name or keyword..."
                      className={`${inputBase} pl-9`}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className={labelBase}>Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={e => onLocationChange(e.target.value)}
                      placeholder="City or district..."
                      className={`${inputBase} pl-9`}
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className={labelBase}>Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      value={category}
                      onChange={e => onCategoryChange(e.target.value)}
                      className={`${inputBase} pl-9 appearance-none`}
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className={labelBase}>Price Range</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        value={minPrice}
                        min={0}
                        onChange={e => onMinPriceChange(e.target.value)}
                        placeholder="Min"
                        className={`${inputBase} pl-7`}
                      />
                    </div>
                    <span className="text-gray-300 font-medium">–</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        value={maxPrice}
                        min={0}
                        onChange={e => onMaxPriceChange(e.target.value)}
                        placeholder="Max"
                        className={`${inputBase} pl-7`}
                      />
                    </div>
                  </div>
                  {(minPrice || maxPrice) && (
                    <p className="mt-1.5 text-xs text-primary font-medium">
                      {minPrice && maxPrice
                        ? `$${minPrice} – $${maxPrice}`
                        : minPrice ? `From $${minPrice}` : `Up to $${maxPrice}`}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className={labelBase}>Minimum Rating</label>
                  <div className="flex gap-2">
                    {RATING_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => onMinRatingChange(opt.value)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                          minRating === opt.value
                            ? 'bg-yellow-400 text-white border-yellow-400 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-400 hover:text-yellow-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verified Providers */}
                <div>
                  <label className={labelBase}>Provider Status</label>
                  <button
                    onClick={() => onVerifiedOnlyChange(!verifiedOnly)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                      verifiedOnly
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">Verified Providers Only</span>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      verifiedOnly ? 'border-white bg-white/20' : 'border-gray-300'
                    }`}>
                      {verifiedOnly && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  </button>
                </div>

                {/* Sort By */}
                <div>
                  <label className={labelBase}>Sort By</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => onSortChange(e.target.value)}
                      className={`${inputBase} appearance-none pr-8`}
                    >
                      {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-gray-100 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-3 bg-primary hover:bg-secondary text-white font-semibold rounded-xl transition-colors shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterBar;
