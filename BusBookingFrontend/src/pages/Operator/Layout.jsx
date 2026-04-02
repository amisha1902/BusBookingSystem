import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const OperatorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { label: 'Dashboard', path: '/operator/dashboard', icon: '📊' },
    { label: 'Bus Operators', path: '/operator/bus-operators', icon: '🏢' },
    { label: 'Buses', path: '/operator/buses/all', icon: '🚌' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <aside
        className="p-4 border-end"
        style={{
          width: '250px',
          minHeight: '100vh',
          backgroundColor: '#f5f6f8', // same as dashboard bg
        }}
      >
        {/* USER INFO */}
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '42px',
                height: '42px',
                backgroundColor: '#e4e7ec',
                color: '#333',
                fontWeight: '600',
              }}
            >
              {user.name?.charAt(0) || 'O'}
            </div>

            <div className="ms-3">
              <h6 className="mb-0 fw-semibold">
                {user.name || 'Operator'}
              </h6>
              <small className="text-muted">
                {user.email || 'operator@example.com'}
              </small>
            </div>
          </div>

          <div className="position-relative">
            <button
              className="btn w-100 mb-2"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              ⋮ Menu
            </button>

            {userMenuOpen && (
              <div
                className="position-absolute w-100 bg-white rounded shadow-sm mt-2"
                style={{ zIndex: 1000 }}
              >
                <button
                  onClick={() => {
                    navigate('/operator/profile');
                    setUserMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  Profile
                </button>

                {/* <button
                  onClick={() => {
                    navigate('/operator/settings');
                    setUserMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  Settings
                </button> */}

                <button
                  onClick={handleLogout}
                  className="dropdown-item text-danger"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="mb-4">
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-100 text-start px-3 py-2 mb-2 border-0 d-flex align-items-center"
                style={{
                  backgroundColor: active ? '#e9ecef' : 'transparent',
                  color: active ? '#000' : '#555',
                  fontWeight: active ? '600' : '500',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <span className="me-2" style={{ fontSize: '16px' }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          className="btn w-100 mt-3"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            color: '#dc3545',
            fontWeight: '500',
          }}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </aside>

      <main
        className="flex-grow-1 p-4"
        style={{ backgroundColor: '#f5f6f8' }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default OperatorLayout;