import { useAuth } from '../context/AuthContext';
import ProviderDashboard from '../components/dashboard/ProviderDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import CustomerDashboard from '../components/features/profile/CustomerDashboard';

function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {user.role === 'provider' && <ProviderDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'customer' && <CustomerDashboard />}
    </div>
  );
}

export default Dashboard;
