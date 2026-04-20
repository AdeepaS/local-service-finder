import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Local Service Finder
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </nav>

        {/* Role placeholder for future auth and role-based navigation */}
        <span className="role-placeholder">Role: Guest</span>
      </div>
    </header>
  )
}

export default Navbar
