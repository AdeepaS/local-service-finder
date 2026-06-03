import { useState, useEffect } from 'react';
import { fetchAllAdminServices, approveService, rejectService } from '../../services/api';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      const data = await fetchAllAdminServices();
      setServices(data.data || []);
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
      
      setServices(services.map(s => s._id === id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const pendingCount = services.filter(s => s.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Moderation</h1>
          </div>
          <p className="text-gray-500 text-lg">Review and manage service listings across the platform.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <h3 className="text-2xl font-bold text-gray-900">{pendingCount}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Services</p>
              <h3 className="text-2xl font-bold text-gray-900">{services.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">All Services Queue</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse">Loading queue...</div>
          ) : services.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-bold">Service Name</th>
                    <th className="p-5 font-bold">Provider</th>
                    <th className="p-5 font-bold">Status</th>
                    <th className="p-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {services.map(service => (
                    <tr key={service._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 font-bold text-gray-900">{service.title}</td>
                      <td className="p-5 text-gray-600 font-medium">{service.providerId?.name || 'Unknown'}</td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          service.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          service.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        {service.status !== 'approved' && (
                          <button 
                            onClick={() => handleStatusChange(service._id, 'approve')}
                            className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                        )}
                        {service.status !== 'rejected' && (
                          <button 
                            onClick={() => handleStatusChange(service._id, 'reject')}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            <XCircle className="w-4 h-4" /> Reject
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
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AdminDashboard;
