import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import passengerApi from "../../api/passengerApi";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const navigate = useNavigate();

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await passengerApi.getMyBookings();
      console.log("Bookings response:", response);
      setBookings(response || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await passengerApi.cancelBooking(bookingId);
      fetchMyBookings();
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container py-4">

      <h2 className="text-center mb-4">My Bookings</h2>

      {loading && (
        <div className="alert alert-info text-center">
          Loading bookings...
        </div>
      )}

      <div className="row g-4">

        {bookings.map((booking) => (
          <div className="col-md-6 col-lg-4" key={booking.id}>

            <div className="card shadow-sm h-100">

              <div className="card-body text-center">

                {/* Route */}
                <h5 className="fw-bold mb-2">
                  {booking.trip?.name}
                </h5>

                {/* Travel date */}
                <p className="text-muted">
                  {booking.trip?.travel_date}
                </p>

                {/* Departure / Arrival */}
                <p className="small">
                  <strong>Departure:</strong>{" "}
                  {formatDate(booking.trip?.departure_time)}
                  <br />
                  <strong>Arrival:</strong>{" "}
                  {formatDate(booking.trip?.arrival_time)}
                </p>

                {/* Seats */}
                <div className="mb-3">
                  {booking.seats?.map((seat) => (
                    <span
                      key={seat.seat_number}
                      className="badge bg-light text-dark border me-1"
                    >
                      {seat.seat_number}
                    </span>
                  ))}
                </div>

                {/* Status badges */}
                <div className="mb-3">

                  <span
                    className={`badge ${
                      booking.status === "cancelled"
                        ? "bg-danger"
                        : "bg-success"
                    } me-2`}
                  >
                    {booking.status}
                  </span>

                  <span
                    className={`badge ${
                      booking.payment_status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-success"
                    }`}
                  >
                    {booking.payment_status}
                  </span>

                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-center gap-2">

                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    View
                  </button>

                  {booking.status !== "cancelled" && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </button>
                  )}

                  {booking.payment_status === "pending" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        navigate(`/payment/${booking.id}`)
                      }
                    >
                      Pay Now
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* Modal */}

      {selectedBooking && (
        <div className="modal fade show" style={{ display: "block" }}>

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Booking #{selectedBooking.id}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setSelectedBooking(null)}
                />

              </div>

              <div className="modal-body">

                <h5>{selectedBooking.trip?.name}</h5>

                <p>
                  <strong>Travel Date:</strong>{" "}
                  {selectedBooking.trip?.travel_date}
                </p>

                <p>
                  <strong>Departure:</strong>{" "}
                  {formatDate(selectedBooking.trip?.departure_time)}
                </p>

                <p>
                  <strong>Arrival:</strong>{" "}
                  {formatDate(selectedBooking.trip?.arrival_time)}
                </p>

                <p>
                  <strong>Seats:</strong>
                </p>

                {selectedBooking.seats?.map((seat) => (
                  <span
                    key={seat.seat_number}
                    className="badge bg-info me-2"
                  >
                    {seat.seat_number}
                  </span>
                ))}

              </div>

              <div className="modal-footer">

                {selectedBooking.payment_status === "pending" && (
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate(`/payment/${selectedBooking.id}`)
                    }
                  >
                    Pay Now
                  </button>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}