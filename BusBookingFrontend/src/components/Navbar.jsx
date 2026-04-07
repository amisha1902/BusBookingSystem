import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { logout } from '../api/authApi'
import { List, HelpCircle, UserCircle } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout: authLogout } = useAuth()

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const hideRoutes = [
    '/login',
    '/signup/passenger',
    '/signup/operator',
    '/operator/dashboard',
    '/operator/bus-operators',
    '/operator/buses',
    '/operator/profile',
    '/operator/setting',
    '/operator/buses/all',
    '/admin/dashboard'
  ]

  const hideNavbar =
    hideRoutes.includes(location.pathname) ||
    /^\/operator\/bus-operators\/\d+\/buses$/.test(location.pathname)

  if (hideNavbar) return null

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top py-2 pb-3 pt-3">
      <div className="container-fluid px-4">

        <Link className="navbar-brand fw-bold text-dark" to="/">
          <img
            src={logo}
            alt="logo"
            style={{ width: "250px", height: "50px" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-4">

            {!isAuthenticated ? (
              <>
                {/* Login */}
                <Link
                  className="nav-link fw-medium text-dark"
                  to="/login"
                >
                  Login
                </Link>

                {/* Sign Up */}
                <Link
                  className="nav-link fw-medium text-dark"
                  to="/signup/passenger"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Bookings */}
                <Link
                  className="nav-link d-flex align-items-center gap-2 text-dark"
                  to="/my-bookings"
                >
                  <List size={20} />
                  <span className="fw-medium">Bookings</span>
                </Link>

                {/* Help */}
                <Link
                  className="nav-link d-flex align-items-center gap-2 text-dark"
                  to="/help"
                >
                  <HelpCircle size={20} />
                  <span className="fw-medium">Help</span>
                </Link>

                {/* Account Dropdown */}
                <div className="nav-item dropdown position-relative">
                  <button
                    className="nav-link btn d-flex align-items-center gap-2 text-dark"
                    onClick={() => setOpen(!open)}
                  >
                    <UserCircle size={24} />
                    <span className="fw-medium">Account</span>
                  </button>

                  {open && (
                    <ul
                      className="dropdown-menu show dropdown-menu-end shadow border-0 mt-2"
                      style={{ position: "absolute", right: 0 }}
                    >
                      <li className="px-3 py-2 small text-muted border-bottom">
                        {user?.name || 'User'}
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/profile"
                          onClick={() => setOpen(false)}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                          disabled={loading}
                        >
                          {loading ? 'Logging out...' : 'Logout'}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
