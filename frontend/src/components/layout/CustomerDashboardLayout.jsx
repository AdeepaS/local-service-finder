import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'

function CustomerDashboardLayout() {
  const { user } = useAuth()

  if (user?.role === 'customer') {
    return (
      <div className="flex bg-gray-50 flex-grow">
        <Sidebar />
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    )
  }

  // Fallback for non-customers (providers or admin) to keep existing layout
  return (
    <div className="flex-grow">
      <Outlet />
    </div>
  )
}

export default CustomerDashboardLayout
