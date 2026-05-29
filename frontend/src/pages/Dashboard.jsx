import { useAuth } from '../context/AuthContext';
import ProviderDashboard from '../components/dashboard/ProviderDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {user.role === 'provider' && <ProviderDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'customer' && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Customer Dashboard</h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
            Welcome to your dashboard! Booking history and saved services will appear here.
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
