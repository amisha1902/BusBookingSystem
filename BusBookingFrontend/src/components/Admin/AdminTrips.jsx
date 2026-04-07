import { useEffect, useState } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import useAuth from '../../hooks/useAuth'

export default function AdminTrips() {
  const { user } = useAuth()
  const { fetchAllTrips, createTrip, cancelTrip, deleteTrip, searchTrips, trips, loading, error } = useAdmin()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [formData, setFormData] = useState({
    bus_id: '',
    route_id: '',
    travel_start_date: '',
    departure_time: '',
    arrival_time: '',
  })

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllTrips(currentPage)
    }
  }, [currentPage, user])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      await searchTrips(searchTerm, { status: filterStatus })
    } else {
      fetchAllTrips(1)
    }
  }

  const handleCreateTrip = async (e) => {
    e.preventDefault()
    try {
      await createTrip(formData)
      setFormData({
        bus_id: '',
        route_id: '',
        travel_start_date: '',
        departure_time: '',
        arrival_time: '',
      })
      setShowCreateForm(false)
      alert('Trip created successfully!')
    } catch (err) {
      console.error('Failed to create trip:', err)
    }
  }

  const handleCancelTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      try {
        await cancelTrip(tripId)
        alert('Trip cancelled successfully!')
      } catch (err) {
        console.error('Failed to cancel trip:', err)
      }
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId)
        alert('Trip deleted successfully!')
      } catch (err) {
        console.error('Failed to delete trip:', err)
      }
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-info'
      case 'completed':
        return 'bg-success'
      case 'cancelled':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <div>
      {/* Header + Create Trip Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Trips Management</h3>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ Schedule Trip'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => {}}></button>
        </div>
      )}

      {/* Create Trip Form */}
      {showCreateForm && (
        <div className="card shadow-sm border-0 mb-4 border-success border-2">
          <div className="card-header bg-success bg-opacity-10">
            <h5 className="mb-0">Schedule New Trip</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateTrip}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Bus ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.bus_id}
                    onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Route ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.route_id}
                    onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Travel Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.travel_start_date}
                    onChange={(e) => setFormData({ ...formData, travel_start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Departure Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.departure_time}
                    onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Arrival Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.arrival_time}
                    onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                Schedule Trip
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-2">
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                placeholder="Search by route..."
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
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
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

      {/* Trips Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-light">
          <h5 className="mb-0">All Trips ({trips.length})</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : trips.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Bus</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Available Seats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td className="py-3">
                        <div className="fw-bold">{trip.bus.bus_name}</div>
                        <small className="text-muted">{trip.bus.bus_no} - {trip.bus.bus_type}</small>
                      </td>
                      <td className="py-3">
                        {trip.route.source_city} → {trip.route.destination_city}
                      </td>
                      <td className="py-3">{trip.travel_start_date?.split('T')[0]}</td>
                      <td className="py-3">{trip.departure_time?.split('T')[1]?.slice(0, 5)}</td>
                      <td className="py-3">{trip.arrival_time?.split('T')[1]?.slice(0, 5)}</td>
                      <td className="py-3">{trip.available_seats}</td>
                      <td className="py-3">
                        <span className={`badge ${getStatusBadgeClass(trip.status)}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="btn-group" role="group">
                          {trip.status === 'scheduled' && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleCancelTrip(trip.id)}
                                title="Cancel"
                              >
                                ⛔ Cancel
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteTrip(trip.id)}
                                title="Delete"
                              >
                                🗑️ Delete
                              </button>
                            </>
                          )}
                          {trip.status !== 'scheduled' && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteTrip(trip.id)}
                              title="Delete"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted">No trips found</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {trips.length > 0 && (
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