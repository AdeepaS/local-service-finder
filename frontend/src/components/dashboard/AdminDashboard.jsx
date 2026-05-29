import { useState, useEffect } from 'react';
import { fetchAllAdminServices, approveService, rejectService } from '../../services/api';

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      const data = await fetchAllAdminServices();
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

  const handleStatusChange = async (id, action) => {
    try {
      if (action === 'approve') await approveService(id);
      else await rejectService(id);
      
      // Update local state
      setServices(services.map(s => s._id === id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Moderation Queue</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">All Services</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Service Name</th>
                  <th className="p-4 font-medium">Provider</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{service.title}</td>
                    <td className="p-4 text-gray-600">{service.providerId?.name || 'Unknown'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        service.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        service.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      {service.status !== 'approved' && (
                        <button 
                          onClick={() => handleStatusChange(service._id, 'approve')}
                          className="bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium px-3 py-1 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {service.status !== 'rejected' && (
                        <button 
                          onClick={() => handleStatusChange(service._id, 'reject')}
                          className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium px-3 py-1 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No services found in the system.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
