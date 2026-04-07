class Booking::Index < Trailblazer::Operation
  step :fetch_bookings
  step :format_bookings

  def fetch_bookings(ctx, current_user:, **)
    ctx[:bookings_list] = current_user.bookings.includes(
      :trip,
      booking_seats: { trip_seat: :seat }
    )

    true
  rescue => e
    ctx[:error] = "Error fetching bookings: #{e.message}"
    false
  end

  def format_bookings(ctx, bookings_list:, **)
    ctx[:bookings_data] = bookings_list.map { |booking|
      {
        id: booking.id,
        status: booking.status,
        total_price: booking.total_price,
        payment_status: booking.payments.last&.status,
        trip: {
          id: booking.trip.id,
          name: "#{booking.trip.route.source_city} → #{booking.trip.route.destination_city}",
          departure_time: booking.trip.departure_time,
          arrival_time: booking.trip.arrival_time,
          travel_date: booking.trip.travel_start_date
        },
        seats: booking.booking_seats.map do |bs|
          {
            seat_number: bs.trip_seat.seat.seat_number,
            seat_type: bs.trip_seat.seat.seat_type,
            deck: bs.trip_seat.seat.deck,
            price: bs.seat_price
          }
        end
      }
    }

    true
  rescue => e
    ctx[:error] = "Error formatting bookings: #{e.message}"
    false
  end
end