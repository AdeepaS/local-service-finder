import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../../../services/favoriteApi';
import EmptyState from '../../ui/EmptyState';

function FavoritesList() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFavorites({ limit: 50 });
      setFavorites(res.data.favorites || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (serviceId) => {
    try {
      await removeFavorite(serviceId);
      setFavorites((prev) => prev.filter((f) => f.service?._id !== serviceId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading saved services...</div>;
  }

  if (error) {
    return <p className="text-red-600 text-center py-8">{error}</p>;
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No saved services"
        message="Save services you like from the service details page."
        actionText="Browse services"
        onAction={() => navigate('/services')}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {favorites.map((fav) => {
        const service = fav.service;
        if (!service) return null;
        return (
          <div
            key={fav._id}
            className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm"
          >
            <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              {service.images?.[0] ? (
                <img src={service.images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <Link
                to={`/services/${service._id}`}
                className="font-bold text-gray-900 hover:text-primary line-clamp-1"
              >
                {service.title}
              </Link>
              <p className="text-sm text-gray-500">{service.category} • {service.location}</p>
              <p className="text-sm font-medium text-gray-800 mt-1">{service.priceRange || 'Quote'}</p>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(service._id)}
              className="text-sm text-red-600 hover:text-red-700 shrink-0 self-start"
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default FavoritesList;
