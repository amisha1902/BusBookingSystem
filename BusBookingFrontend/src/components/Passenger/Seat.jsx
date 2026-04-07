export default function Seat({ seat, selectedSeats, setSelectedSeats }) {
  const isSelected = selectedSeats.includes(seat.id);
  const isSleeper = seat.seat_type === 'sleeper';
  const isBooked = seat.status === 'booked';

  const toggleSeat = () => {
    if (isBooked) return;
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  return (
    <div
      className={`seat-box ${seat.seat_type} ${seat.status} ${isSelected ? 'selected' : ''}`}
      onClick={toggleSeat}
      title={`${seat.seat_number} - ₹${seat.seat_price}`}
    >
      {isSleeper ? (
        <div className="seat-inner sleeper-shape">
          <span className="seat-num">{seat.seat_number}</span>
        </div>
      ) : (
        <div className="seat-inner seater-shape">
          <div className="seat-back" />
          <div className="seat-base">
            <span className="seat-num">{seat.seat_number}</span>
          </div>
        </div>
      )}
    </div>
  );
}