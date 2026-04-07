import { useNavigate } from 'react-router-dom'

export default function AdminNav({ activeTab, setActiveTab }) {
  const navigate = useNavigate()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'passengers', label: 'Users', icon: '👥' },
    { id: 'operators', label: 'Bus Operators', icon: '🚌' },
    { id: 'routes', label: 'Routes', icon: '🗺️' },
    { id: 'trips', label: 'Trips', icon: '📅' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="bg-light border-bottom sticky-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between py-3 mb-0">
          <div>
            <h2 className="mb-0">Admin Dashboard</h2>
            <small className="text-muted">Manage your bus booking system</small>
          </div>
        </div>

        <ul className="nav nav-tabs d-flex" role="tablist">
          {/* Normal Tabs */}
          {tabs.map(tab => (
            <li className="nav-item" key={tab.id} role="presentation">
              <button
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                <span className="me-2">{tab.icon}</span>
                {tab.label}
              </button>
            </li>
          ))}

          <li className="nav-item ms-auto">
            <button
              className="nav-link text-danger fw-bold"
              onClick={handleLogout}
              role="tab"
              aria-selected={activeTab === 'logout'}
            >
              <span className="me-2">🚪</span> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}