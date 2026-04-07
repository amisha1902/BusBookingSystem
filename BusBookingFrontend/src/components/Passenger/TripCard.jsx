// import './TripCard.css'

export default function TripCard({ trip, onViewDetails }) {
  // Format time from datetime string
  const formatTime = (datetime) => {
    if (!datetime) return 'N/A'
    return new Date(datetime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Format date
  const formatDate = (datetime) => {
    if (!datetime) return 'N/A'
    return new Date(datetime).toLocaleDateString('en-IN')
  }

  // Calculate duration
  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A'
    const startTime = new Date(start)
    const endTime = new Date(end)
    const diffMs = endTime - startTime
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHours}h ${diffMins}m`
  }

  return (
    <div className="trip-card">
      <div className="card shadow-sm border-0 h-100">
        {/* Header with bus type badge */}
        <div className="card-header bg-light border-bottom">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-1 fw-bold text-dark">{trip.bus_name || 'Bus'}</h6>
              <small className="text-muted">
                {trip.bus_type?.replace(/_/g, ' ').toUpperCase() || 'Standard'}
              </small>
            </div>
            <span className="badge bg-success">{trip.available_seats || 0} Seats</span>
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Route */}
          <div className="trip-route mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1 fw-bold">{trip.source || 'Source'}</p>
                <small className="text-muted">
                  {formatTime(trip.departure_time)}
                </small>
              </div>
              <div className="text-center">
                <i className="bi bi-arrow-right text-primary"></i>
                <br />
                <small className="text-muted">
                  {calculateDuration(trip.departure_time, trip.arrival_time)}
                </small>
              </div>
              <div className="text-end">
                <p className="mb-1 fw-bold">{trip.destination || 'Destination'}</p>
                <small className="text-muted">
                  {formatTime(trip.arrival_time)}
                </small>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="trip-date mb-3 pb-3 border-bottom">
            <small className="text-muted">
              <i className="bi bi-calendar"></i> {formatDate(trip.departure_time)}
            </small>
          </div>

          {/* Details Grid */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <small className="text-muted d-block">Bus Operator</small>
              <small className="fw-600">{trip.operator_name || 'N/A'}</small>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">Seats Available</small>
              <small className="fw-600 text-success">{trip.available_seats || 0}</small>
            </div>
          </div>

          {/* Price */}
          <div className="trip-price mb-3">
            <h5 className="mb-0">
              <span className="text-primary fw-bold">₹{trip.price || trip.base_fare || 0}</span>
              <small className="text-muted">/seat</small>
            </h5>
          </div>

          {/* Ratings (if available) */}
          {trip.rating && (
            <div className="trip-rating mb-3">
              <div className="d-flex align-items-center">
                <span className="text-warning me-1">★ {trip.rating}</span>
                <small className="text-muted">({trip.total_reviews || 0} reviews)</small>
              </div>
            </div>
          )}

          {/* Amenities (if available) */}
          {trip.amenities && trip.amenities.length > 0 && (
            <div className="trip-amenities mb-3">
              <small className="text-muted d-block mb-2">Amenities:</small>
              <div className="d-flex flex-wrap gap-1">
                {trip.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="badge bg-light text-dark">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with CTA Button */}
        <div className="card-footer bg-light border-top">
          <button
            className="btn btn-primary w-100"
            onClick={onViewDetails}
            disabled={trip.available_seats === 0}
          >
            {trip.available_seats === 0 ? 'Sold Out' : 'View & Book'}
          </button>
        </div>
      </div>
    </div>
  )
}