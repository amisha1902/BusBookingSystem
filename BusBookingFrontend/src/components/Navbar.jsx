import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { logout } from '../api/authApi'
import '../styles/navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout: authLogout } = useAuth()
  const [loading, setLoading] = useState(false)

  const authPages = ['/login', '/signup/passenger', '/signup/operator']
  if (authPages.includes(location.pathname)) {
    return null
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
      authLogout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light ourbus-navbar sticky-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand ourbus-brand" to="/">
          <span className="brand-icon">🚌 </span>
          <span className="brand-name">OurBus</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">
                <span>🏠</span> Home
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#offers">
                <span>🎟️</span> Offers
              </a>
            </li>

            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom" to="/login">
                    <span>🔐</span> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <div className="nav-divider"></div>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link nav-link-custom dropdown-toggle"
                    href="#"
                    id="signupDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span>👤</span> Sign Up
                  </a>
                  <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="signupDropdown">
                    <li>
                      <Link className="dropdown-item" to="/signup/passenger">
                        <span>🧑</span> As Passenger
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/signup/operator">
                        <span>🏢</span> As Bus Operator
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link nav-link-custom dropdown-toggle user-menu"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span>👤</span> {user?.name || 'Account'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom" aria-labelledby="userDropdown">
                    <li>
                      <span className="dropdown-header">
                        <strong>{user?.name}</strong>
                        <br />
                        <small className="text-muted">{user?.email}</small>
                      </span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        <span>📊</span> Dashboard
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                        disabled={loading}
                      >
                        <span>🚪</span> {loading ? 'Logging out...' : 'Logout'}
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}