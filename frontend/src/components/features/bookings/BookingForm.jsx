import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { createBooking } from '../../../services/bookingApi';
import { getAddresses } from '../../../services/addressApi';

function BookingForm({ service, onClose, onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [form, setForm] = useState({
    title: service?.title || '',
    description: '',
    location: service?.location || '',
    requestedDate: '',
    expectedDuration: '',
    notes: '',
    estimatedPrice: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await getAddresses();
        const list = res.data || [];
        setAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          setForm((prev) => ({
            ...prev,
            location: formatAddress(defaultAddr),
          }));
        }
      } catch {
        // User may have no addresses yet
      }
    };
    if (user) loadAddresses();
  }, [user]);

  const formatAddress = (addr) =>
    [addr.street, addr.city, addr.province, addr.postalCode].filter(Boolean).join(', ');

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
    const addr = addresses.find((a) => a._id === addressId);
    if (addr) {
      setForm((prev) => ({ ...prev, location: formatAddress(addr) }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const selected = addresses.find((a) => a._id === selectedAddressId);

    try {
      const response = await createBooking({
        serviceId: service._id,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        location: form.location.trim(),
        latitude: selected?.latitude,
        longitude: selected?.longitude,
        requestedDate: new Date(form.requestedDate).toISOString(),
        expectedDuration: form.expectedDuration ? Number(form.expectedDuration) : undefined,
        notes: form.notes.trim() || undefined,
        estimatedPrice: form.estimatedPrice ? Number(form.estimatedPrice) : undefined,
      });
      
      // Show success toast notification
      toast.success((response?.data?.message || 'Booking created successfully!'), {
        duration: 4000,
        position: 'bottom-center',
        style: {
          background: '#bbf7d0',
          color: '#166534',
          fontWeight: '600',
          padding: '14px 18px',
          borderRadius: '8px',
          border: '1px solid #86efac',
        },
        iconTheme: {
          primary: '#16a34a',
          secondary: '#bbf7d0',
        },
      });
      
      onSuccess?.();
      onClose?.();
      navigate('/profile?tab=bookings');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create booking';
      setError(errorMsg);
      toast.error('❌ ' + errorMsg, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Book service</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {addresses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saved address</label>
              <select
                value={selectedAddressId}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                {addresses.map((addr) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.label} — {formatAddress(addr)}
                    {addr.isDefault ? ' (default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {addresses.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                <a href="/profile?tab=addresses" className="text-primary hover:underline">
                  Add a saved address
                </a>{' '}
                in your profile for faster booking.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requested date & time</label>
            <input
              type="datetime-local"
              name="requestedDate"
              value={form.requestedDate}
              onChange={handleChange}
              min={minDate}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
              <input
                type="number"
                name="expectedDuration"
                value={form.expectedDuration}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (optional)</label>
              <input
                type="number"
                name="estimatedPrice"
                value={form.estimatedPrice}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary hover:bg-secondary text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Confirm booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
