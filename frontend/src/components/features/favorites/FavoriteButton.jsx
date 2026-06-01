import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { checkIsFavorited, toggleFavorite } from '../../../services/favoriteApi';

function FavoriteButton({ serviceId, className = '' }) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'customer' || !serviceId) return;

    const load = async () => {
      try {
        const res = await checkIsFavorited(serviceId);
        setIsFavorited(res.data.isFavorited);
      } catch {
        setIsFavorited(false);
      }
    };
    load();
  }, [user, serviceId]);

  if (!user || user.role !== 'customer') return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await toggleFavorite(serviceId);
      setIsFavorited(res.data.isFavorited);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
        isFavorited
          ? 'border-red-200 bg-red-50 text-red-600'
          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
      } ${className}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className="w-5 h-5"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {isFavorited ? 'Saved' : 'Save'}
    </button>
  );
}

export default FavoriteButton;
