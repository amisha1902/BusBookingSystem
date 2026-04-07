import { useEffect, useState } from 'react'
import { useAdmin } from '../../hooks/useAdmin'

export default function AdminOperators() {
  const { fetchAllOperators, verifyOperator, deleteOperator, searchOperators, operators, loading, error } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchAllOperators(currentPage)
  }, [currentPage])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      await searchOperators(searchTerm, filterStatus)
    } else {
      fetchAllOperators(1)
    }
  }

  const handleVerify = async (operatorId) => {
    try {
      await verifyOperator(operatorId)
      alert('Operator verified successfully!')
    } catch (err) {
      console.error('Failed to verify operator:', err)
    }
  }

  const handleDelete = async (operatorId) => {
    if (window.confirm('Are you sure you want to delete this operator?')) {
      try {
        await deleteOperator(operatorId)
      } catch (err) {
        console.error('Failed to delete operator:', err)
      }
    }
  }

  const pendingOperators = operators.filter(o => !o.is_verified)
  const verifiedOperators = operators.filter(o => o.is_verified)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Bus Operators Management</h3>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      )}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-2">
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {pendingOperators.length > 0 && (
        <div className="card shadow-sm border-0 mb-4 border-warning border-2">
          <div className="card-header bg-warning bg-opacity-10">
            <h5 className="mb-0 text-warning">⚠️ Pending Verifications ({pendingOperators.length})</h5>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="p-4 text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Company Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>License</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOperators.map(operator => (
                      <tr key={operator.id}>
                        <td className="py-3">
                          <div className="fw-bold">{operator.company_name}</div>
                        </td>
                        <td className="py-3 text-muted">{operator.contact_email}</td>
                        <td className="py-3 text-muted">{operator.contact_phone}</td>
                        <td className="py-3 text-muted">{operator.license_no}</td>
                        <td className="py-3">
                          <span className="badge bg-warning">Pending</span>
                        </td>
                        <td className="py-3">
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleVerify(operator.id)}
                              title="Verify"
                            >
                              ✓ Verify
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(operator.id)}
                              title="Reject"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-header bg-light">
          <h5 className="mb-0">Verified Operators ({verifiedOperators.length})</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : verifiedOperators.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>License</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedOperators.map(operator => (
                    <tr key={operator.id}>
                      <td className="py-3">
                        <div className="fw-bold">{operator.company_name}</div>
                      </td>
                      <td className="py-3 text-muted">{operator.contact_email}</td>
                      <td className="py-3 text-muted">{operator.contact_phone}</td>
                      <td className="py-3 text-muted">{operator.license_no}</td>
                      <td className="py-3">
                        <span className="badge bg-success">Verified</span>
                      </td>
                      <td className="py-3">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(operator.id)}
                          title="Delete"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted">No verified operators yet</div>
          )}
        </div>
      </div>

      {operators.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">{currentPage}</span>
              </li>
              <li className="page-item">
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}