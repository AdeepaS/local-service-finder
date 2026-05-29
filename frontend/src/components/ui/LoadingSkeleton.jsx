import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../utils/animations';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[380px] flex flex-col"
        >
          {/* Image Skeleton */}
          <div className="h-48 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />

          {/* Content Skeleton */}
          <div className="p-5 flex flex-col flex-grow space-y-4">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-4/5" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
            </div>

            {/* Provider & Location skeleton */}
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Footer skeleton */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-1/3" />
              <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-1/4" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoadingSkeleton;
