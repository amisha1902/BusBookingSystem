export default function TripSidebar({ trip, selectedSeats, boardingCity, dropCity }) {
  if (!trip) return null;
  console.log(trip?.route)
  console.log(trip?.route?.route_stops)
  const total = selectedSeats.reduce((sum, seatId) => {
    const seat = trip?.trip_seats?.find(s => s.id === seatId);
    return sum + (seat?.seat_price || 0);
  }, 0);

  const firstSeat = trip?.trip_seats?.find(s => s.id === selectedSeats[0]);
  const seatPrice = firstSeat?.seat_price || 0;
  const departure = new Date(trip.departure_time);
  const arrival = new Date(trip.arrival_time);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date) =>
    date.toLocaleDateString();

  // Use selected cities — fallback to route cities if not provided
  const sourceCity = boardingCity || trip?.route?.source_city;
  const destCity = dropCity || trip?.route?.destination_city;

  // Unique cities from route stops in order
  const uniqueCities = trip?.route?.route_stops
    ? [...new Map(
        [...trip.route.route_stops]
          .sort((a, b) => a.stop_order - b.stop_order)
          .map(stop => [stop.city_name, stop])
      ).values()]
    : [];

  return (
    <div className="card shadow-sm">
      <div className="card-body">

        {/* BUS INFO */}
        <h5 className="card-title">{trip.operator?.company_name || trip.bus?.operator_name}</h5>
        <p className="mb-1 fw-semibold">{trip.bus?.bus_name}</p>
        <p className="text-muted small">
          {trip.bus?.bus_type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </p>

        {/* RATING */}
        <div className="mb-3">
          <span className="badge bg-success">
            ⭐ {trip.bus?.rating || 4.5}
          </span>
        </div>

        <hr />

        {/* YOUR JOURNEY — selected cities */}
        <div className="mb-1">
          <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
            Your Journey
          </small>
        </div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="mb-0 fw-bold text-danger">{sourceCity}</h6>
            <h5 className="mb-0">{formatTime(departure)}</h5>
            <small className="text-muted">{formatDate(departure)}</small>
          </div>
          <div className="text-center px-2 pt-2">
            <span className="text-muted">→</span>
          </div>
          <div className="text-end">
            <h6 className="mb-0 fw-bold text-danger">{destCity}</h6>
            <h5 className="mb-0">{formatTime(arrival)}</h5>
            <small className="text-muted">{formatDate(arrival)}</small>
          </div>
        </div>

        <hr />

        <div className="mb-3">
          <h6 className="fw-bold mb-2">Full Route</h6>
          {uniqueCities.length > 0 ? (
            <div>
              {uniqueCities.map((stop, index) => {
                const isLast = index === uniqueCities.length - 1;
                const isBoarding = stop.city_name === sourceCity;
                const isDrop = stop.city_name === destCity;
                return (
                  <div key={index} className="d-flex align-items-start">
                    <div className="d-flex flex-column align-items-center me-2" style={{ width: '16px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: isBoarding || isDrop ? '#dc3545' : '#adb5bd',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px #adb5bd',
                        flexShrink: 0,
                        marginTop: '3px'
                      }} />
                      {!isLast && (
                        <div style={{
                          width: '2px',
                          height: '22px',
                          backgroundColor: '#dee2e6'
                        }} />
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span
                        className="small fw-semibold"
                        style={{ color: isBoarding || isDrop ? '#dc3545' : '#212529' }}
                      >
                        {stop.city_name}
                      </span>
                      {isBoarding && (
                        <span className="badge bg-danger" style={{ fontSize: '10px' }}>
                          Boarding
                        </span>
                      )}
                      {isDrop && (
                        <span className="badge bg-dark" style={{ fontSize: '10px' }}>
                          Drop
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ul className="list-group list-group-flush small">
              {trip?.route?.route_stops?.map((stop, index) => (
                <li key={index} className="list-group-item px-0">
                  {stop.stop_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <hr />

        {/* CANCELLATION POLICY */}
        <div className="mb-3">
          <h6 className="fw-bold">Cancellation Policy</h6>
          <div className="small">
            <div className="d-flex justify-content-between mb-1">
              <span>Before {formatDate(departure)}</span>
              <span className="text-success fw-semibold">90% refund</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>6 hrs before departure</span>
              <span className="text-warning fw-semibold">50% refund</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>After departure</span>
              <span className="text-danger fw-semibold">No refund</span>
            </div>
          </div>
        </div>

        <hr />

        {/* FARE SUMMARY */}
        <div>
          <h6 className="fw-bold">Fare Summary</h6>
          <div className="d-flex justify-content-between small mb-1">
            <span>Seat Price</span>
            <span>₹{seatPrice.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-1">
            <span>Seats Selected</span>
            <span>{selectedSeats.length}</span>
          </div>
          <hr className="my-2" />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span className="text-danger">₹{total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}