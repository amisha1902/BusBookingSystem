export default function SeatLegend() {
  return (
    <div className="seat-legend">
      <h6 className="mb-3 fw-bold">Know your seat types</h6>
      <div className="legend-grid">
        <div className="legend-item">
          <div className="legend-seat available-legend" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat booked-legend" />
          <span>Already booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat selected-legend" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon">🪑</div>
          <span>Seater</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon">🛏️</div>
          <span>Sleeper</span>
        </div>
      </div>
    </div>
  );
}