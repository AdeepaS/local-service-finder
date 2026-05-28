import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Could replace with a proper spinner component
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Or navigate to a 403 Forbidden page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
