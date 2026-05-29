import { useState, useEffect } from 'react';
import { fetchMyServices, deleteService } from '../../services/api';
import { Link } from 'react-router-dom';
import ConfirmModal from '../ui/ConfirmModal';

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const loadServices = async () => {
    try {
      const data = await fetchMyServices();
      setServices(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteService(serviceToDelete);
      setServices(services.filter(s => s._id !== serviceToDelete));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
        <Link to="/services/create" className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add New Service
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">My Services</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Service Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Active</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{service.title}</td>
                    <td className="p-4 text-gray-600">{service.category}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        service.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        service.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${service.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {service.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/services/edit/${service._id}`} className="text-primary hover:underline text-sm font-medium mr-4">Edit</Link>
                      <button 
                        onClick={() => { setServiceToDelete(service._id); setDeleteModalOpen(true); }}
                        className="text-red-600 hover:underline text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't listed any services yet.</p>
            <Link to="/services/create" className="text-primary font-medium hover:underline">Create your first service</Link>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProviderDashboard;
