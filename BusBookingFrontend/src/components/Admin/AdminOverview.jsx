import { useEffect } from 'react'
import { useAdmin } from '../../hooks/useAdmin'

export default function AdminOverview() {
  const { fetchAllUsers, fetchAllOperators, fetchAllRoutes, fetchAllTrips, users, operators, routes, trips, loading } = useAdmin()

  useEffect(() => {
    fetchAllUsers(1, {})
    fetchAllOperators(1, {})
    fetchAllRoutes(1, {})
    fetchAllTrips(1, {})
  }, [])

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      color: 'primary',
      icon: '👥',
    },
    {
      label: 'Bus Operators',
      value: operators.length,
      color: 'success',
      icon: '🚌',
    },
    {
      label: 'Active Routes',
      value: routes.length,
      color: 'info',
      icon: '🗺️',
    },
    {
      label: 'Scheduled Trips',
      value: trips.filter(t => t.status === 'scheduled').length,
      color: 'warning',
      icon: '📅',
    },
  ]

  return (
    <div>
      <div className="row mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-6 col-lg-3 mb-3">
            <div className={`card border-0 shadow-sm bg-light`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">{stat.label}</small>
                    <h3 className={`mb-0 text-${stat.color}`}>{stat.value}</h3>
                  </div>
                  <div className="fs-1 opacity-50">{stat.icon}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">Recent Users</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="p-3 text-center">Loading...</div>
              ) : users.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <tbody>
                      {users.slice(0, 5).map(user => (
                        <tr key={user.id}>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-primary rounded-circle me-3"
                                style={{ width: '35px', height: '35px', flex: '0 0 35px' }}
                              >
                                <span className="d-flex justify-content-center align-items-center h-100 text-white fw-bold">
                                  {user.name?.[0]?.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="fw-bold">{user.name}</div>
                                <small className="text-muted">{user.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-end py-3">
                            <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'}`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-3 text-center text-muted">No users yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">Pending Operator Verifications</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="p-3 text-center">Loading...</div>
              ) : operators.filter(o => !o.is_verified).length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <tbody>
                      {operators.filter(o => !o.is_verified).slice(0, 5).map(op => (
                        <tr key={op.id}>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-warning rounded-circle me-3"
                                style={{ width: '35px', height: '35px', flex: '0 0 35px' }}
                              >
                                <span className="d-flex justify-content-center align-items-center h-100 text-white fw-bold">
                                  {op.company_name?.[0]?.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="fw-bold">{op.company_name}</div>
                                <small className="text-muted">{op.contact_email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-end py-3">
                            <span className="badge bg-warning">Pending</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-3 text-center text-muted">All operators verified</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}