import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import AIAssistant from '../customer/AIAssistant'

function CustomerDashboardLayout() {
  const { user } = useAuth()

  if (user?.role === 'customer') {
    return (
      <div className="flex bg-gray-50 flex-grow relative">
        <Sidebar />
        <div className="flex-grow">
          <Outlet />
        </div>
        <AIAssistant />
      </div>
    )
  }

  // Fallback for non-customers (providers or admin) to keep existing layout
  return (
    <div className="flex-grow relative">
      <Outlet />
    </div>
  )
}

export default CustomerDashboardLayout
