import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchServiceById } from '../services/api';

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchServiceById(id);
        setService(data.data.service);
        setProvider(data.data.provider);
        setReviews(data.data.reviews);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-12"></div>
        <div className="h-32 bg-gray-200 rounded mb-8"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-6">{error || 'Service not found'}</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline font-medium">
          &larr; Go Back
        </button>
      </div>
    );
  }

  const imageUrl = service.images?.length > 0 
    ? service.images[0] 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(service.category)}&background=random&size=800`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6 flex gap-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to={`/services?category=${encodeURIComponent(service.category)}`} className="hover:text-primary">
          {service.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{service.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Image Gallery (Placeholder for 1 image for now) */}
          <div className="rounded-2xl overflow-hidden mb-8 h-[400px] border border-gray-100 shadow-sm">
            <img src={imageUrl} alt={service.title} className="w-full h-full object-cover" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{service.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-100">
            <span className="flex items-center gap-1 bg-blue-50 text-primary px-3 py-1 rounded-full font-medium">
              {service.category}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {service.location}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {service.ratingAverage > 0 ? `${service.ratingAverage.toFixed(1)} (${service.totalReviews} reviews)` : 'No reviews yet'}
            </span>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About this service</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {service.description || 'No description provided.'}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((r, idx) => (
                  <div key={idx} className="bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{r.user?.name || 'Anonymous'}</span>
                      <div className="flex items-center text-yellow-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{r.comment}</p>
                    {r.createdAt && <p className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews yet for this service.</p>
            )}
          </div>
        </div>

        {/* Sidebar Sticky Panel */}
        <div className="lg:w-1/3">
          <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-6 sticky top-6">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Pricing</p>
              <h3 className="text-2xl font-bold text-gray-900">{service.priceRange || 'Contact for price'}</h3>
            </div>
            
            <button className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 rounded-xl transition-colors mb-4 shadow-md">
              Book Service
            </button>
            <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-colors">
              Message Provider
            </button>

            {provider && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  <img 
                    src={provider.profile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random`} 
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Provided by</p>
                  <p className="font-bold text-gray-900">{provider.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ServiceDetails;
