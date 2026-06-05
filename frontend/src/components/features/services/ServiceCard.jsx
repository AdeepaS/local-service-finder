import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';
import LazyImage from '../../common/LazyImage';
import { cardHoverVariants, itemVariants } from '../../../utils/animations';

const StarIcon = ({ filled }) => (
  <svg
    className={`w-3.5 h-3.5 ${filled ? 'text-yellow-400' : 'text-gray-200'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <StarIcon key={i} filled={i <= Math.round(rating)} />
    ))}
  </div>
);

/**
 * ServiceCard Component
 * Enhanced card displaying service image, name, provider, category,
 * location, starting price, rating, and verified badge.
 */
const ServiceCard = memo(({ service }) => {
  const {
    _id,
    title,
    providerId,
    category,
    location,
    priceRange,
    ratingAverage,
    totalReviews,
    images,
  } = service;

  const imageUrl =
    images?.length > 0
      ? images[0]
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(category)}&background=random&size=400`;

  const providerName =
    typeof providerId === 'object' ? providerId?.name : 'Provider';

  const isVerified =
    typeof providerId === 'object' ? providerId?.isApproved === true : false;

  const rating = ratingAverage > 0 ? ratingAverage : null;

  // Format numeric price
  const formattedPrice =
    priceRange !== null && priceRange !== undefined
      ? `$${Number(priceRange).toLocaleString()}`
      : 'Quote';

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <motion.div
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer"
        variants={cardHoverVariants}
        initial="idle"
        whileHover="hover"
      >
        {/* ── Image ─────────────────────────────────────────────────────── */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 shrink-0">
          <LazyImage
            src={imageUrl}
            alt={title}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
            objectFit="cover"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
            {category}
          </div>

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold text-gray-700">{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Verified badge */}
          {isVerified && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </div>
          )}
        </div>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-primary transition-colors duration-200 leading-snug">
            {title}
          </h3>

          {/* Provider */}
          <p className="text-sm text-gray-500 font-medium mb-1 line-clamp-1">
            {providerName}
            {isVerified && (
              <span className="ml-1.5 inline-flex items-center gap-0.5 text-emerald-600 text-xs font-semibold">
                <ShieldCheck className="w-3 h-3" />
              </span>
            )}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{location || 'Location not specified'}</span>
          </div>

          {/* Star rating row */}
          {rating ? (
            <div className="flex items-center gap-1.5 mb-3">
              <RatingStars rating={rating} />
              <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
              {totalReviews > 0 && (
                <span className="text-xs text-gray-400">({totalReviews})</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 mb-3">
              <RatingStars rating={0} />
              <span className="text-xs text-gray-400">No reviews yet</span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-gray-400 font-medium">Starting from</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{formattedPrice}</p>
            </div>
            <Link
              to={`/services/${_id}`}
              className="inline-block text-white font-semibold text-sm px-4 py-2 rounded-xl bg-primary hover:bg-secondary transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
