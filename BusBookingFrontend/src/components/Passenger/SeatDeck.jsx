import Seat from "./Seat";

export default function SeatDeck({ title, seats, selectedSeats, setSelectedSeats, showDriver }) {
  if (!seats || seats.length === 0) return null;

  // Group by row — seat_number like "L11", "L12", "L13" → row = "L1"
  const rows = {};
  seats.forEach(seat => {
    // Extract row key: everything except last character
    const row = seat.seat_number.slice(0, -1);
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  // Sort seats within each row by last character
  Object.keys(rows).forEach(row => {
    rows[row].sort((a, b) => {
      const aCol = parseInt(a.seat_number.slice(-1));
      const bCol = parseInt(b.seat_number.slice(-1));
      return aCol - bCol;
    });
  });

  const sortedRows = Object.keys(rows).sort();

  return (
    <div className="deck-section">
      <div className="deck-label">{title}</div>

      {/* Bus front with driver */}
      {showDriver && (
        <div className="bus-front">
          <div className="driver-area">
            <div className="steering-wheel">
              <svg viewBox="0 0 40 40" width="32" height="32">
                <circle cx="20" cy="20" r="18" stroke="#555" strokeWidth="3" fill="none" />
                <circle cx="20" cy="20" r="5" fill="#555" />
                <line x1="20" y1="2" x2="20" y2="15" stroke="#555" strokeWidth="2.5" />
                <line x1="2" y1="20" x2="15" y2="20" stroke="#555" strokeWidth="2.5" />
                <line x1="38" y1="20" x2="25" y2="20" stroke="#555" strokeWidth="2.5" />
              </svg>
            </div>
            <span className="driver-label">Driver</span>
          </div>
          <div className="bus-door">
            <div className="door-icon">🚪</div>
            <span className="door-label">Door</span>
          </div>
        </div>
      )}

      {/* Seat grid */}
      <div className="seat-grid">
        {sortedRows.map(rowKey => {
          const rowSeats = rows[rowKey];
          // col1 = first seat, gap, col2 col3 = remaining seats (redbus layout)
          const col1 = rowSeats.slice(0, 1);
          const col2 = rowSeats.slice(1);

          return (
            <div className="seat-row-rb" key={rowKey}>
              {/* Left side - 1 seat */}
              <div className="seat-col-left">
                {col1.map(seat => (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    selectedSeats={selectedSeats}
                    setSelectedSeats={setSelectedSeats}
                  />
                ))}
              </div>

              {/* Aisle gap */}
              <div className="aisle-gap" />

              {/* Right side - remaining seats */}
              <div className="seat-col-right">
                {col2.map(seat => (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    selectedSeats={selectedSeats}
                    setSelectedSeats={setSelectedSeats}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}