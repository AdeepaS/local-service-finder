import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCustomerBookings, cancelBooking } from '../../../services/bookingApi';
import EmptyState from '../../ui/EmptyState';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

function BookingHistory({ limit }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: limit || 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await getCustomerBookings(params);
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter, limit]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(bookingId, { reason: 'Cancelled by customer' });
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading bookings...</div>;
  }

  if (error) {
    return <p className="text-red-600 text-center py-8">{error}</p>;
  }

  return (
    <div>
      {!limit && (
        <div className="mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {Object.keys(STATUS_STYLES).map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      )}

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          message="Book a service from its details page to get started."
          actionText="Find services"
          onAction={() => navigate('/services')}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{booking.title}</h3>
                  {booking.serviceId?.title && (
                    <Link
                      to={`/services/${booking.serviceId._id || booking.serviceId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {booking.serviceId.title}
                    </Link>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[booking.status] || 'bg-gray-100'}`}>
                  {booking.status?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{booking.location}</p>
              <p className="text-sm text-gray-500">
                Requested: {new Date(booking.requestedDate).toLocaleString()}
              </p>
              {booking.providerId?.name && (
                <p className="text-sm text-gray-500 mt-1">Provider: {booking.providerId.name}</p>
              )}
              {['PENDING', 'ACCEPTED'].includes(booking.status) && !limit && (
                <button
                  type="button"
                  onClick={() => handleCancel(booking._id)}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
