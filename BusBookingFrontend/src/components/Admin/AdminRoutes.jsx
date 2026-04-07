import { useEffect, useState } from 'react'
import { useAdmin } from '../../hooks/useAdmin'

export default function AdminRoutes() {

  const {
    fetchAllRoutes,
    getRouteDetails,
    createRoute,
    deleteRoute,
    updateRouteStop,
    deleteRouteStop,
    searchRoutes,
    addRouteStop,
    routes,
    selectedRoute,
    routeStops,
    loading,
    error,
  } = useAdmin()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showStopsModal, setShowStopsModal] = useState(false)
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const [showStopForm, setShowStopForm] = useState(false)

  const [formData, setFormData] = useState({
    source_city: '',
    destination_city: '',
    total_distance_km: '',
  })

  const [stopForm, setStopForm] = useState({
    city_name: '',
    stop_name: '',
    stop_address: '',
    stop_order: '',
    km_from_source: '',
    scheduled_arrival_time: '',
    scheduled_departure_time: '',
    halt_mins: '',
    is_boarding_point: false,
    is_drop_point: false
  })

  useEffect(() => {
    fetchAllRoutes(currentPage)
  }, [currentPage])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      await searchRoutes(searchTerm)
    } else {
      fetchAllRoutes(1)
    }
  }

  const handleCreateRoute = async (e) => {
    e.preventDefault()
    try {
      await createRoute(formData)
      setFormData({ source_city: '', destination_city: '', total_distance_km: '' })
      setShowCreateForm(false)
      alert('Route created successfully!')
    } catch (err) {
      console.error('Failed to create route:', err)
    }
  }

  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await deleteRoute(routeId)
      alert('Route deleted successfully!')
    } catch (err) {
      console.error('Failed to delete route:', err)
    }
  }

  const handleViewStops = async (routeId) => {
    await getRouteDetails(routeId)
    setSelectedRouteId(routeId)
    setShowStopsModal(true)
  }

  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      if (stopForm.id) {
        await updateRouteStop(selectedRouteId, stopForm.id, stopForm);
        alert('Stop updated successfully');
      } else {
        await addRouteStop(selectedRouteId, stopForm);
        alert('Stop added successfully');
      }
      await getRouteDetails(selectedRouteId);
      setStopForm({
        city_name: '',
        stop_name: '',
        stop_address: '',
        stop_order: '',
        km_from_source: '',
        scheduled_arrival_time: '',
        scheduled_departure_time: '',
        halt_mins: '',
        is_boarding_point: false,
        is_drop_point: false
      });
      setShowStopForm(false);
    } catch (err) {
      console.error('Failed to add/update stop', err);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to delete this stop?')) return;
    try {
      await deleteRouteStop(selectedRouteId, stopId);
      await getRouteDetails(selectedRouteId);
      alert('Stop deleted successfully!');
    } catch (err) {
      console.error('Failed to delete stop', err);
    }
  };

  const handleEditStop = (stop) => {
    setStopForm({ ...stop });
    setShowStopForm(true);
  };

  return (
    <div className='container-fluid'>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Routes Management</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Add Route'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Create Route Form */}
      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleCreateRoute}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Source City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.source_city}
                    onChange={(e) => setFormData({ ...formData, source_city: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Destination City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.destination_city}
                    onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Distance (km)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.total_distance_km}
                    onChange={(e) => setFormData({ ...formData, total_distance_km: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button className="btn btn-success">Create Route</button>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-2">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100">Search</button>
            </div>
          </form>
        </div>
      </div>

      {/* Routes List */}
      <div className="row">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : routes.length > 0 ? (
          routes.map(route => (
            <div key={route.id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>{route.source_city} → {route.destination_city}</h5>
                  <small>Distance: {route.total_distance_km} km</small>
                  <br />
                  <small>Stops: {route.stops_count || 0}</small>
                  <div className="mt-3">
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => handleViewStops(route.id)}
                    >
                      Stops
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteRoute(route.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">No routes found</div>
        )}
      </div>

      {/* ROUTE STOPS MODAL */}
      {showStopsModal && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: '95%' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Route Stops</h5>
                  <button
                    className="btn btn-success btn-sm me-3"
                    onClick={() => setShowStopForm(!showStopForm)}
                  >
                    + Add Stop
                  </button>
                  <button
                    className="btn-close"
                    onClick={() => setShowStopsModal(false)}
                  />
                </div>

                <div className="modal-body">
                  {selectedRoute && (
                    <>
                      <h6>{selectedRoute.source_city} → {selectedRoute.destination_city}</h6>

                      {showStopForm && (
                        <form onSubmit={handleAddStop} className="border p-3 mb-3 rounded">
                          <div className="row">
                            <div className="col-md-4 mb-2">
                              <label className="form-label">City Name</label>
                              <input
                                className="form-control"
                                value={stopForm.city_name}
                                onChange={(e) => setStopForm({ ...stopForm, city_name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-md-4 mb-2">
                              <label className="form-label">Stop Name</label>
                              <input
                                className="form-control"
                                value={stopForm.stop_name}
                                onChange={(e) => setStopForm({ ...stopForm, stop_name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-md-4 mb-2">
                              <label className="form-label">Stop Address</label>
                              <input
                                className="form-control"
                                value={stopForm.stop_address}
                                onChange={(e) => setStopForm({ ...stopForm, stop_address: e.target.value })}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Stop Order</label>
                              <input
                                type="number"
                                className="form-control"
                                value={stopForm.stop_order}
                                onChange={(e) => setStopForm({ ...stopForm, stop_order: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <label className="form-label">KM From Source</label>
                              <input
                                type="number"
                                className="form-control"
                                value={stopForm.km_from_source}
                                onChange={(e) => setStopForm({ ...stopForm, km_from_source: e.target.value })}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Arrival Time</label>
                              <input
                                type="time"
                                className="form-control"
                                value={stopForm.scheduled_arrival_time}
                                onChange={(e) => setStopForm({ ...stopForm, scheduled_arrival_time: e.target.value })}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Departure Time</label>
                              <input
                                type="time"
                                className="form-control"
                                value={stopForm.scheduled_departure_time}
                                onChange={(e) => setStopForm({ ...stopForm, scheduled_departure_time: e.target.value })}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Halt Minutes</label>
                              <input
                                type="number"
                                className="form-control"
                                value={stopForm.halt_mins}
                                onChange={(e) => setStopForm({ ...stopForm, halt_mins: e.target.value })}
                              />
                            </div>
                            <div className="col-md-3 mb-2 form-check mt-4">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={stopForm.is_boarding_point}
                                onChange={(e) => setStopForm({ ...stopForm, is_boarding_point: e.target.checked })}
                              />
                              <label className="form-check-label">Boarding Point</label>
                            </div>
                            <div className="col-md-3 mb-2 form-check mt-4">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={stopForm.is_drop_point}
                                onChange={(e) => setStopForm({ ...stopForm, is_drop_point: e.target.checked })}
                              />
                              <label className="form-check-label">Drop Point</label>
                            </div>
                          </div>
                          <button className="btn btn-success mt-2">Add Route Stop</button>
                        </form>
                      )}

                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Order</th>
                              <th>City</th>
                              <th>Stop</th>
                              <th>Address</th>
                              <th>KM from Source</th>
                              <th>Arrival Time</th>
                              <th>Departure Time</th>
                              <th>Halt (mins)</th>
                              <th>Boarding</th>
                              <th>Drop</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {routeStops.map(stop => (
                              <tr key={stop.id}>
                                <td>{stop.stop_order}</td>
                                <td>{stop.city_name}</td>
                                <td>{stop.stop_name}</td>
                                <td>{stop.stop_address}</td>
                                <td>{stop.km_from_source}</td>
                                <td>{stop.scheduled_arrival_time}</td>
                                <td>{stop.scheduled_departure_time}</td>
                                <td>{stop.halt_mins}</td>
                                <td>{stop.is_boarding_point ? 'Yes' : 'No'}</td>
                                <td>{stop.is_drop_point ? 'Yes' : 'No'}</td>
                                <td>
                                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditStop(stop)}>Edit</button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteStop(stop.id)}>Delete</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowStopsModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

    </div>
  )
}