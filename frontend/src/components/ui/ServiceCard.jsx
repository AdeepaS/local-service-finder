import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const { _id, title, providerId, category, location, priceRange, ratingAverage, images } = service;
  
  // Use first image if available, otherwise placeholder
  const imageUrl = images?.length > 0 
    ? images[0] 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(category)}&background=random&size=400`;

  const providerName = typeof providerId === 'object' ? providerId?.name : 'Provider';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
          {category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={title}>{title}</h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{providerName} • {location}</p>
        
        <div className="flex items-center gap-1 mb-4">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{ratingAverage > 0 ? ratingAverage.toFixed(1) : 'New'}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-bold text-gray-900">{priceRange || 'Price on request'}</span>
          <Link 
            to={`/services/${_id}`}
            className="text-primary hover:text-secondary font-medium text-sm px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
