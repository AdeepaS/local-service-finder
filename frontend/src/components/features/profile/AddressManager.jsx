import { useState, useEffect } from 'react';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../../../services/addressApi';

const EMPTY_FORM = {
  label: '',
  street: '',
  city: '',
  province: '',
  postalCode: '',
  isDefault: false,
};

function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setEditingId(addr._id);
    setForm({
      label: addr.label || '',
      street: addr.street || '',
      city: addr.city || '',
      province: addr.province || '',
      postalCode: addr.postalCode || '',
      isDefault: !!addr.isDefault,
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await createAddress(form);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      loadAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await deleteAddress(addressId);
      loadAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      loadAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set default');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading addresses...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 text-sm">Manage delivery and service locations for bookings.</p>
        <button
          type="button"
          onClick={openCreate}
          className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + Add address
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="font-bold text-gray-900">{editingId ? 'Edit address' : 'New address'}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="label" placeholder="Label (e.g. Home)" value={form.label} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
            <input name="street" placeholder="Street" value={form.street} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 sm:col-span-2" />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
            <input name="province" placeholder="Province" value={form.province} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
            <input name="postalCode" placeholder="Postal code" value={form.postalCode} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
            Set as default address
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No addresses saved yet.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr._id} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-wrap justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {addr.street}, {addr.city}, {addr.province} {addr.postalCode}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                {!addr.isDefault && (
                  <button type="button" onClick={() => handleSetDefault(addr._id)} className="text-primary hover:underline">
                    Set default
                  </button>
                )}
                <button type="button" onClick={() => openEdit(addr)} className="text-gray-600 hover:text-gray-900">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(addr._id)} className="text-red-600 hover:text-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressManager;
