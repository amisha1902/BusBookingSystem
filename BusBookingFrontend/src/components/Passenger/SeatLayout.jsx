import SeatDeck from "./SeatDeck";
import SeatLegend from "./SeatLegend";

export default function SeatLayout({ trip, selectedSeats, setSelectedSeats }) {
  const seats = trip?.trip_seats || [];
  const lowerSeats = seats.filter(s => s.deck === "lower");
  const upperSeats = seats.filter(s => s.deck === "upper");
  const hasUpper = upperSeats.length > 0;

  return (
    <div className="seat-layout-card">
      <div className="deck-wrapper">
        <SeatDeck
          title="Lower Deck"
          seats={lowerSeats}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          showDriver={true}
        />
        {hasUpper && (
          <SeatDeck
            title="Upper Deck"
            seats={upperSeats}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            showDriver={false}
          />
        )}
      </div>
      <div className="mt-4">
        <SeatLegend />
      </div>
    </div>
  );
}