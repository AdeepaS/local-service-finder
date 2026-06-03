import { useState, useEffect } from 'react';
import { fetchMyServices, deleteService } from '../../services/api';
import { Link } from 'react-router-dom';
import ConfirmModal from '../ui/ConfirmModal';
import ProviderBookings from '../features/bookings/ProviderBookings';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, Plus, Edit2, Trash2 } from 'lucide-react';

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

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const loadServices = async () => {
    try {
      const data = await fetchMyServices();
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

  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Provider Dashboard</h1>
            <p className="text-gray-500 text-lg">Manage your service portfolio and incoming requests.</p>
          </div>
          <Link to="/services/create" className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            <Plus className="w-5 h-5" />
            Add New Service
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Services</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalServices}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Services</p>
              <h3 className="text-2xl font-bold text-gray-900">{activeServices}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900">--</h3>
              <p className="text-xs text-gray-400">See below</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services List */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  My Services
                </h2>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-gray-500 animate-pulse">Loading services...</div>
              ) : services.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {services.map(service => (
                    <div key={service._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{service.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium text-gray-700">{service.category}</span>
                          <span className={`px-2.5 py-1 rounded-md font-medium ${
                            service.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            service.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </span>
                          <span className={`px-2.5 py-1 rounded-md font-medium ${service.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/services/edit/${service._id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => { setServiceToDelete(service._id); setDeleteModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 mb-4">You haven't listed any services yet.</p>
                  <Link to="/services/create" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Create your first service
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bookings Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <ProviderBookings />
          </motion.div>
        </div>

      </motion.div>

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
