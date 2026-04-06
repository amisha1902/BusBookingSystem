import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import PassengerDetailsForm from '../../components/Passenger/PassengerDetailsForm';
import { usePassenger } from "../../hooks/usePassenger";

export default function PassengerDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { createBooking } = usePassenger();
  const { trip, selectedSeats, boarding, drop } = state || {};

  const [passengers, setPassengers] = useState(
    selectedSeats.map(seatId => ({ seat_id: seatId, name: '', age: '', gender: 'male' }))
  );

  const updatePassenger = (idx, data) => {
    const updated = [...passengers];
    updated[idx] = { ...updated[idx], ...data };
    setPassengers(updated);
  };

  const handleBooking = async () => {
    if (passengers.some(p => !p.name || !p.age)) {
      return alert("Please fill all details");
    }

    const allSeats = trip?.trip_seats || [];
    if (allSeats.length === 0) {
      alert("Seat data is missing. Please try selecting seats again.");
      return;
    }

    const seatIds = passengers.map(p => p.seat_id); 

    const payload = {
      trip_id: trip.id,
      seat_ids: seatIds,
      boarding_stop_id: boarding.id,
      drop_stop_id: drop.id,
      passengers: passengers.map(p => ({
        name: p.name,
        age: p.age,
        gender: p.gender
      }))
    };

    try {
      const res = await createBooking(payload);
      const newBookingId = res.booking_id || res.data?.id || res.id;

      if (newBookingId) {
        navigate(`/passenger/booking/${newBookingId}`);
      } else {
        console.error("Booking created but no ID returned", res);
      }
    } catch (err) {
      console.error("Booking failed:", err.response?.data);
      const errorMsg = err.response?.data?.errors?.join(', ') || "Booking failed. Please try again.";
      alert(errorMsg);
    }
  };

  const totalAmount = passengers.reduce((sum, p) => {
    const seat = trip?.trip_seats?.find(s => s.id === p.seat_id);
    return sum + (seat?.seat_price || 0);
  }, 0);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <h4 className="fw-bold mb-4">Passenger Details</h4>
          {passengers.map((p, i) => {
            const seat = trip?.trip_seats?.find(s => s.id === p.seat_id);
            return (
              <div key={p.seat_id} className="card border-0 shadow-sm rounded-4 p-4 mb-3">
                <PassengerDetailsForm
                  seatNumber={seat?.seat_number}   
                  passengerIndex={i}
                  onChange={(data) => updatePassenger(i, data)}
                />
                <p className="text-muted mt-2">Fare: ₹{seat?.seat_price?.toFixed(2)}</p>
              </div>
            );
          })}
          <button
            className="btn btn-danger btn-lg w-100 rounded-pill mt-3 shadow"
            onClick={handleBooking}
          >
            PROCEED TO REVIEW
          </button>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '20px' }}>
            <h6 className="fw-bold text-danger mb-3">FARE SUMMARY</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Total Seats</span> <span>{passengers.length}</span>
            </div>
            <div className="d-flex justify-content-between border-top pt-2 fw-bold">
              <span>Total Amount</span> <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
