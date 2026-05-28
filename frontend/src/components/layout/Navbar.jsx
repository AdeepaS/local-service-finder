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
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Local Service Finder
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <button onClick={handleLogout} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563', fontWeight: 500 }}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>

        <span className="role-placeholder">Role: {user ? user.role : 'Guest'}</span>
      </div>
    </header>
  )
}

export default Navbar
