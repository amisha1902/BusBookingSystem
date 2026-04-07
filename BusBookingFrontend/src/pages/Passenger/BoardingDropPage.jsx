import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePassenger } from "../../hooks/usePassenger";

export default function BoardingDropPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { trip, selectedSeats, boardingCity, dropCity } = location.state || {};

  const {
    boardingPoints,
    dropPoints,
    loading,
    error,
    fetchBoardingPoints,
    fetchDropPoints
  } = usePassenger();

  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDrop, setSelectedDrop] = useState(null);

  useEffect(() => {
    const loadPoints = async () => {
      if (trip?.id) {
        try {
          // Use boardingCity from search if available, else fallback to route source
          await fetchBoardingPoints(trip.id, boardingCity || trip.route?.source_city);
          // Use dropCity from search if available, else fallback to route destination
          await fetchDropPoints(trip.id, dropCity || trip.route?.destination_city);
        } catch (err) {
          console.error("Failed to load points:", err);
        }
      }
    };
    loadPoints();
  }, [trip?.id]);

  // Filter boarding points by selected boarding city
  const filteredBoardingPoints = boardingCity
    ? boardingPoints.filter(p => p.city_name === boardingCity)
    : boardingPoints;

  // Filter drop points by selected drop city
  const filteredDropPoints = dropCity
    ? dropPoints.filter(p => p.city_name === dropCity)
    : dropPoints;

  const formatTime = (t) => {
    if (!t) return '--:--';
    return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleContinue = () => {
    if (!selectedBoarding || !selectedDrop) {
      alert("Please select both points");
      return;
    }
    navigate("/passenger-details", {
      state: {
        trip,
        selectedSeats,
        boarding: selectedBoarding,
        drop: selectedDrop,
        boardingCity,
        dropCity
      }
    });
  };

  if (loading && boardingPoints.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: '1100px' }}>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Journey Header */}
        {(boardingCity || dropCity) && (
          <div className="d-flex align-items-center gap-2 mb-4">
            <span className="fw-bold text-dark fs-5">{boardingCity}</span>
            <span className="text-muted">→</span>
            <span className="fw-bold text-dark fs-5">{dropCity}</span>
          </div>
        )}

        <div className="row g-4 mt-2">

          {/* BOARDING CARD */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-0 py-3 px-4">
                <h6 className="mb-0 fw-bold text-dark">Boarding points</h6>
                <small className="text-muted">
                  {boardingCity ? `Stops in ${boardingCity}` : 'Select Boarding Point'}
                </small>
              </div>
              <div className="list-group list-group-flush" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                {filteredBoardingPoints.length === 0 ? (
                  <div className="p-4 text-center text-muted small">
                    No boarding points found for {boardingCity}
                  </div>
                ) : (
                  filteredBoardingPoints.map((point) => (
                    <label
                      key={point.id}
                      className={`list-group-item list-group-item-action d-flex align-items-center py-3 px-4 border-start-0 border-end-0 ${selectedBoarding?.id === point.id ? 'bg-light' : ''}`}
                      style={{ cursor: 'pointer', transition: '0.2s' }}
                    >
                      <div className="me-4 fw-bold text-dark" style={{ minWidth: '60px', fontSize: '0.95rem' }}>
                        {formatTime(point.scheduled_departure_time)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem' }}>
                          {point.stop_name}
                        </div>
                        <small className="text-muted d-block">{point.city_name}</small>
                        <small className="text-muted d-block">{point.stop_address}</small>
                      </div>
                      <div className="ms-2">
                        <input
                          type="radio"
                          name="boarding"
                          className="form-check-input border-secondary custom-radio"
                          checked={selectedBoarding?.id === point.id}
                          onChange={() => setSelectedBoarding(point)}
                        />
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* DROP CARD */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-0 py-3 px-4">
                <h6 className="mb-0 fw-bold text-dark">Dropping points</h6>
                <small className="text-muted">
                  {dropCity ? `Stops in ${dropCity}` : 'Select Dropping Point'}
                </small>
              </div>
              <div className="list-group list-group-flush" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                {filteredDropPoints.length === 0 ? (
                  <div className="p-4 text-center text-muted small">
                    No drop points found for {dropCity}
                  </div>
                ) : (
                  filteredDropPoints.map((point) => (
                    <label
                      key={point.id}
                      className={`list-group-item list-group-item-action d-flex align-items-center py-3 px-4 border-start-0 border-end-0 ${selectedDrop?.id === point.id ? 'bg-light' : ''}`}
                      style={{ cursor: 'pointer', transition: '0.2s' }}
                    >
                      <div className="me-4 fw-bold text-dark" style={{ minWidth: '60px', fontSize: '0.95rem' }}>
                        {formatTime(point.scheduled_arrival_time)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem' }}>
                          {point.stop_name}
                        </div>
                        <small className="text-muted d-block">{point.city_name}</small>
                        <small className="text-muted d-block">{point.stop_address}</small>
                      </div>
                      <div className="ms-2">
                        <input
                          type="radio"
                          name="drop"
                          className="form-check-input border-secondary custom-radio"
                          checked={selectedDrop?.id === point.id}
                          onChange={() => setSelectedDrop(point)}
                        />
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="mt-5 text-center">
          <button
            className="btn btn-danger btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg border-0"
            style={{ letterSpacing: '1px', fontSize: '0.9rem' }}
            onClick={handleContinue}
            disabled={!selectedBoarding || !selectedDrop}
          >
            CONTINUE TO PASSENGER DETAILS
          </button>
        </div>
      </div>

      <style>{`
        .custom-radio:checked {
          background-color: #d84e55 !important;
          border-color: #d84e55 !important;
          box-shadow: 0 0 0 0.25rem rgba(216, 78, 85, 0.2);
        }
        .list-group-item-action:hover {
          background-color: #fdf2f2;
        }
        .form-check-input:checked {
          border-color: #d84e55;
        }
      `}</style>
    </div>
  );
}