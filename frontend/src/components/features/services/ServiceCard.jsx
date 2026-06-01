import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { memo } from 'react';
import LazyImage from '../../common/LazyImage';
import { cardHoverVariants, itemVariants } from '../../../utils/animations';

const ServiceCard = memo(({ service }) => {
  const { _id, title, providerId, category, location, priceRange, ratingAverage, images } = service;

  const imageUrl = images?.length > 0
    ? images[0]
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(category)}&background=random&size=400`;

  const providerName = typeof providerId === 'object' ? providerId?.name : 'Provider';
  const rating = ratingAverage > 0 ? ratingAverage.toFixed(1) : null;

  return (
    <motion.div variants={itemVariants} whileHover="hover" initial="hidden" animate="visible">
      <motion.div
        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group"
        variants={cardHoverVariants}
        initial="idle"
        whileHover="hover"
      >
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <LazyImage src={imageUrl} alt={title} className="w-full h-full" objectFit="cover" />
          <motion.div
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-md border border-white/20"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {category}
          </motion.div>
          {rating && (
            <motion.div
              className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-white/20"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold text-gray-700">{rating}</span>
            </motion.div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <motion.h3
            className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-sm text-gray-500 mb-3 line-clamp-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className="font-medium text-gray-700">{providerName}</span>
            <span className="text-gray-400"> • </span>
            <span>{location}</span>
          </motion.p>
          <motion.div className="flex-grow" />
          <motion.div
            className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div>
              <p className="text-xs text-gray-500 font-medium">From</p>
              <p className="text-lg font-bold text-gray-900">{priceRange || 'Quote'}</p>
            </div>
            <Link
              to={`/services/${_id}`}
              className="inline-block text-white font-semibold text-sm px-4 py-2.5 rounded-lg bg-primary hover:bg-secondary transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-lg"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
