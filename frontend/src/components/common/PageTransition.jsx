import { motion } from 'framer-motion';
import { pageVariants } from '../../utils/animations';

/**
 * PageTransition Component
 * Wraps pages to provide smooth entrance/exit animations
 * Use with routes for professional page transition effects
 */
const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
