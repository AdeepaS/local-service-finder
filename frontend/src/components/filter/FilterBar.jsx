import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Tag, DollarSign, Star, ShieldCheck,
  SlidersHorizontal, X, ChevronDown, RotateCcw
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'recent',     label: 'Recently Added' },
  { value: 'rating',     label: 'Highest Rated'  },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
];

const RATING_OPTIONS = [
  { value: '',  label: 'All' },
  { value: '3', label: '3★+' },
  { value: '4', label: '4★+' },
];

const filterLabel = (key, value) => {
  const map = {
    search:      `"${value}"`,
    location:    value,
    category:    value,
    minPrice:    `From $${value}`,
    maxPrice:    `Up to $${value}`,
    minRating:   `${value}★+`,
    verifiedOnly:'Verified',
    sortBy:      SORT_OPTIONS.find(o => o.value === value)?.label,
  };
  return map[key] ?? value;
};

/**
 * FilterBar
 * - Sticks below the navbar; collapses on scroll-down, expands on scroll-up
 * - Uses max-height collapse (not transform) so content never overlaps cards
 * - Mobile: compact search row + slide-in drawer
 */
const FilterBar = ({
  searchTerm, location, category,
  minPrice, maxPrice, minRating, verifiedOnly, sortBy,
  onSearchChange, onLocationChange, onCategoryChange,
  onMinPriceChange, onMaxPriceChange, onMinRatingChange,
  onVerifiedOnlyChange, onSortChange,
  onApplyFilters, onResetFilters, onRemoveFilter,
  activeFilters = [],
  categories = [],
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visible, setVisible]       = useState(true);
  const [navOffset, setNavOffset]   = useState(73);
  const [barHeight, setBarHeight]   = useState(0);
  const lastScrollY = useRef(0);
  const innerRef    = useRef(null);

  // ── Measure navbar height for sticky offset ──────────────────────────────
  useEffect(() => {
    const measureNav = () => {
      const header = document.querySelector('header');
      if (header) setNavOffset(header.offsetHeight);
    };
    measureNav();
    window.addEventListener('resize', measureNav);
    return () => window.removeEventListener('resize', measureNav);
  }, []);

  // ── Measure bar height (changes when active chips appear) ────────────────
  useEffect(() => {
    const node = innerRef.current;
    if (!node) return undefined;

    const measure = () => setBarHeight(node.scrollHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // ── Scroll-aware visibility ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const threshold = barHeight || 80;

      if (current <= threshold) {
        setVisible(true);
      } else if (current < lastScrollY.current - 10) {
        setVisible(true);
      } else if (current > lastScrollY.current + 10) {
        setVisible(false);
      }
      lastScrollY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [barHeight]);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const handleApply = () => { onApplyFilters(); closeDrawer(); };
  const handleReset = () => { onResetFilters(); closeDrawer(); };

  const revealFilters = () => {
    setVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputBase =
    'w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ' +
    'placeholder-gray-400 transition-all duration-200';

  const labelBase = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <>
      {/* ── Collapsible sticky bar ─────────────────────────────────────────── */}
      <div
        className="sticky z-30 overflow-hidden bg-white border-b border-gray-200 shadow-sm transition-[max-height,opacity] duration-300 ease-in-out"
        style={{
          top: navOffset,
          maxHeight: visible ? barHeight || 999 : 0,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
        aria-hidden={!visible}
      >
        <div ref={innerRef} className="max-w-7xl mx-auto px-4">

          {/* ── Mobile row ──────────────────────────────────────────────────── */}
          <div className="md:hidden flex items-center gap-2 py-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilters.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* ── Desktop rows ────────────────────────────────────────────────── */}
          <div className="hidden md:block">
            {/* Row 1: search + sort + actions */}
            <div className="flex items-center gap-3 pt-3 pb-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services by name or keyword..."
                  value={searchTerm}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={e => onSortChange(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white min-w-[165px]"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={onApplyFilters}
                className="shrink-0 px-5 py-2.5 bg-primary hover:bg-secondary text-white text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap"
              >
                Search
              </button>

              {activeFilters.length > 0 && (
                <button
                  onClick={handleReset}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Row 2: filter chips */}
            <div className="flex items-center gap-2 pb-3 flex-wrap">
              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={e => onLocationChange(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-44"
                />
              </div>

              {/* Category */}
              <div className="relative">
                <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select
                  value={category}
                  onChange={e => onCategoryChange(e.target.value)}
                  className="appearance-none pl-8 pr-7 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white text-gray-700 w-48"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Price range */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <DollarSign className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="number" placeholder="Min" value={minPrice} min={0}
                  onChange={e => onMinPriceChange(e.target.value)}
                  className="w-16 text-sm bg-transparent focus:outline-none placeholder-gray-400"
                />
                <span className="text-gray-300 text-sm">–</span>
                <input
                  type="number" placeholder="Max" value={maxPrice} min={0}
                  onChange={e => onMaxPriceChange(e.target.value)}
                  className="w-16 text-sm bg-transparent focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-1 py-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 ml-1 shrink-0" />
                {RATING_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onMinRatingChange(opt.value)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      minRating === opt.value
                        ? 'bg-yellow-400 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Verified */}
              <button
                onClick={() => onVerifiedOnlyChange(!verifiedOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  verifiedOnly
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </button>
            </div>
          </div>

          {/* ── Active chips ────────────────────────────────────────────────── */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-3 flex flex-wrap gap-1.5"
              >
                {activeFilters.map(([key, value]) => (
                  <motion.span
                    key={key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  >
                    {filterLabel(key, value)}
                    {onRemoveFilter && (
                      <button onClick={() => onRemoveFilter(key)} className="hover:text-red-500 transition-colors ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.span>
                ))}
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-red-500 font-medium self-center transition-colors"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Floating reveal button (shown when bar is collapsed) ─────────────── */}
      <AnimatePresence>
        {!visible && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={revealFilters}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-primary hover:bg-secondary text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters.length > 0 && (
              <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                {activeFilters.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
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
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="md:hidden fixed right-0 top-0 bottom-0 w-[88vw] max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-primary" />
                  <h2 className="text-base font-bold text-gray-900">Filters</h2>
                  {activeFilters.length > 0 && (
                    <span className="bg-primary text-white rounded-full px-2 py-0.5 text-[10px] font-bold">{activeFilters.length}</span>
                  )}
                </div>
                <button onClick={closeDrawer} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 p-5 space-y-5 overflow-y-auto">
                {/* Location */}
                <div>
                  <label className={labelBase}>Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={location} onChange={e => onLocationChange(e.target.value)}
                      placeholder="City or district..." className={`${inputBase} pl-9`} />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className={labelBase}>Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select value={category} onChange={e => onCategoryChange(e.target.value)}
                      className={`${inputBase} pl-9 appearance-none`}>
                      <option value="">All Categories</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className={labelBase}>Price Range</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                      <input type="number" value={minPrice} min={0} onChange={e => onMinPriceChange(e.target.value)}
                        placeholder="Min" className={`${inputBase} pl-7`} />
                    </div>
                    <span className="text-gray-300">–</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                      <input type="number" value={maxPrice} min={0} onChange={e => onMaxPriceChange(e.target.value)}
                        placeholder="Max" className={`${inputBase} pl-7`} />
                    </div>
                  </div>
                  {(minPrice || maxPrice) && (
                    <p className="mt-1.5 text-xs text-primary font-semibold">
                      {minPrice && maxPrice ? `$${minPrice} – $${maxPrice}` : minPrice ? `From $${minPrice}` : `Up to $${maxPrice}`}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className={labelBase}>Minimum Rating</label>
                  <div className="grid grid-cols-3 gap-2">
                    {RATING_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => onMinRatingChange(opt.value)}
                        className={`py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                          minRating === opt.value
                            ? 'bg-yellow-400 text-white border-yellow-400 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-400'
                        }`}>
                        {opt.value === '' ? 'Any' : opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verified */}
                <div>
                  <label className={labelBase}>Provider Status</label>
                  <button
                    onClick={() => onVerifiedOnlyChange(!verifiedOnly)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
                      verifiedOnly ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className={`w-5 h-5 ${verifiedOnly ? 'text-emerald-500' : 'text-gray-400'}`} />
                      <span className="text-sm font-semibold">Verified Providers Only</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      verifiedOnly ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                    }`}>
                      {verifiedOnly && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  </button>
                </div>

                {/* Sort */}
                <div>
                  <label className={labelBase}>Sort By</label>
                  <div className="relative">
                    <select value={sortBy} onChange={e => onSortChange(e.target.value)}
                      className={`${inputBase} appearance-none pr-9`}>
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                <button onClick={handleReset}
                  className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
                  Reset
                </button>
                <button onClick={handleApply}
                  className="py-3 bg-primary hover:bg-secondary text-white font-semibold rounded-xl text-sm transition-colors shadow-md">
                  Apply
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
