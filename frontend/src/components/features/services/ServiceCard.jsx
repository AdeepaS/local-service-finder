import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { MapPin, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import LazyImage from '../../common/LazyImage';
import { itemVariants } from '../../../utils/animations';

const CATEGORY_COLORS = {
  'Plumbing':         'bg-blue-500/90 text-white',
  'Electrical':       'bg-amber-500/90 text-white',
  'AC Repair':        'bg-cyan-500/90 text-white',
  'Appliance Repair': 'bg-purple-500/90 text-white',
  'Carpentry':        'bg-orange-500/90 text-white',
  'Cleaning':         'bg-emerald-500/90 text-white',
  'Painting':         'bg-rose-500/90 text-white',
};

const ServiceCard = memo(({ service }) => {
  const {
    _id, title, providerId, category,
    location, priceRange, ratingAverage, totalReviews, images,
  } = service;

  const imageUrl =
    images?.length > 0
      ? images[0]
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(category || 'S')}&background=6366f1&color=fff&size=400`;

  const providerName = typeof providerId === 'object' ? (providerId?.name ?? 'Provider') : 'Provider';
  const isVerified   = typeof providerId === 'object' ? !!providerId?.isApproved : false;
  const rating       = ratingAverage > 0 ? ratingAverage : null;

  const formattedPrice =
    priceRange !== null && priceRange !== undefined
      ? `$${Number(priceRange).toLocaleString()}`
      : 'Get Quote';

  const categoryStyle = CATEGORY_COLORS[category] ?? 'bg-gray-700/90 text-white';

  return (
    <motion.article
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <Link
        to={`/services/${_id}`}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View ${title}`}
      />

      {/* ── Image ────────────────────────────────────────────────────── */}
      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-gray-100 shrink-0">
        <LazyImage
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          objectFit="cover"
        />

        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Category badge */}
        {category && (
          <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm ${categoryStyle}`}>
            {category}
          </span>
        )}

        {/* Rating pill */}
        {rating ? (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {rating.toFixed(1)}
            {totalReviews > 0 && (
              <span className="text-gray-400 font-medium">({totalReviews})</span>
            )}
          </span>
        ) : (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-medium text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
            New
          </span>
        )}

        {isVerified && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            <ShieldCheck className="w-2.5 h-2.5" />
            Verified
          </span>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-grow p-4">

        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        <p className="mt-1 text-xs text-gray-500 line-clamp-1">
          {providerName}
        </p>

        {location && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        <div className="flex-grow min-h-[0.5rem]" />

        {/* Footer */}
        <div className="flex items-end justify-between gap-3 pt-3 mt-2 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Starting at</p>
            <p className="text-lg font-extrabold text-gray-900 leading-tight">{formattedPrice}</p>
          </div>
          <span className="relative z-20 flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-200">
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
