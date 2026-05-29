import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants } from '../../utils/animations';

/**
 * LazyImage Component
 * Lazy loads images to improve initial page load performance
 * Prevents CLS (Cumulative Layout Shift) by using aspect ratio
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = null,
  width = null,
  height = null,
  objectFit = 'cover',
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  // Load image when in view
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      // Keep placeholder visible on error
    };
  }, [isInView, src]);

  const containerStyle = {
    width: width || '100%',
    height: height || '100%',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit,
    display: isLoading && !imageSrc ? 'none' : 'block',
  };

  return (
    <div ref={imgRef} style={containerStyle} className={className}>
      {isLoading && !imageSrc && placeholder ? (
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
      ) : null}

      {imageSrc ? (
        <motion.img
          src={imageSrc}
          alt={alt}
          style={imageStyle}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
