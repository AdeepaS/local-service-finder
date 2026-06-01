import { useState, useEffect } from 'react';
import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  startBooking,
  completeBooking,
} from '../../../services/bookingApi';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const params = { limit: 30 };
      if (statusFilter) params.status = statusFilter;
      const res = await getProviderBookings(params);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const runAction = async (fn, bookingId, body) => {
    try {
      await fn(bookingId, body);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading booking requests...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between gap-4 items-center">
        <h2 className="text-lg font-bold text-gray-900">Booking requests</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {Object.keys(STATUS_STYLES).map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {bookings.length === 0 ? (
        <p className="p-8 text-center text-gray-500">No bookings in this status.</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-6">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900">{booking.title}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[booking.status]}`}>
                  {booking.status?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600">{booking.location}</p>
              <p className="text-sm text-gray-500">
                {new Date(booking.requestedDate).toLocaleString()} • {booking.customerId?.name || 'Customer'}
              </p>
              {booking.notes && <p className="text-sm text-gray-500 mt-1">Notes: {booking.notes}</p>}

              <div className="flex flex-wrap gap-2 mt-4">
                {booking.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      onClick={() => runAction(acceptBooking, booking._id)}
                      className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const reason = window.prompt('Rejection reason (optional)') || '';
                        runAction(rejectBooking, booking._id, { reason });
                      }}
                      className="text-sm border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </>
                )}
                {booking.status === 'ACCEPTED' && (
                  <button
                    type="button"
                    onClick={() => runAction(startBooking, booking._id)}
                    className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg"
                  >
                    Start job
                  </button>
                )}
                {booking.status === 'IN_PROGRESS' && (
                  <button
                    type="button"
                    onClick={() => runAction(completeBooking, booking._id)}
                    className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg"
                  >
                    Mark complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProviderBookings;
