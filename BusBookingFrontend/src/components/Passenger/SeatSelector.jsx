export default function SeatSelector({
  tripSeats = [],        // pass trip.trip_seats here
  bookedSeats = [],
  selectedSeats = [],
  onSelectSeat,
}) {
  const isSeatBooked = (seatId) => bookedSeats.includes(seatId)
  const isSeatSelected = (seatId) => selectedSeats.includes(seatId)

  const handleSeatClick = (seatId) => {
    if (!isSeatBooked(seatId)) {
      onSelectSeat(seatId)   // ✅ pass trip_seat.id
    }
  }

  return (
    <div className="seat-selector">
      {/* Legend */}
      <div className="mb-3 d-flex gap-3">
        <div>
          <button className="seat-btn" style={{ width: '40px', height: '40px' }}></button>
          <small className="d-block text-muted mt-2">Available</small>
        </div>
        <div>
          <button className="seat-btn selected" style={{ width: '40px', height: '40px' }}></button>
          <small className="d-block text-muted mt-2">Selected</small>
        </div>
        <div>
          <button className="seat-btn booked" style={{ width: '40px', height: '40px' }}></button>
          <small className="d-block text-muted mt-2">Booked</small>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid">
        {tripSeats.map((seat) => {
          const isBooked = isSeatBooked(seat.id)
          const isSelected = isSeatSelected(seat.id)

          return (
            <button
              key={seat.id}
              className={`seat-btn ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
              onClick={() => handleSeatClick(seat.id)}
              disabled={isBooked}
              title={`Seat ${seat.seat_number}`}
            >
              {seat.seat_number}
            </button>
          )
        })}
      </div>

      {/* Info */}
      <div className="text-center">
        <p className="text-muted mb-2">
          <strong>{selectedSeats.length}</strong> seat(s) selected
        </p>
        {selectedSeats.length > 0 && (
          <p className="text-primary fw-600">
            Seats: {selectedSeats.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
