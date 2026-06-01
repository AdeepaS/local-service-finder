import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary hover:text-secondary transition-colors">
          Local Service Finder
        </Link>

        <nav className="flex gap-6 items-center">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition-colors'}
          >
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition-colors'}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition-colors'}
              >
                Profile
              </NavLink>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition-colors'}
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition-colors'}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>

        <span className="text-sm text-gray-600 font-medium">Role: {user ? user.role : 'Guest'}</span>
      </div>
    </header>
  )
}

export default Navbar
