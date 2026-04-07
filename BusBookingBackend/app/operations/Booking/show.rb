class Booking::Show < Trailblazer::Operation
  step :find_booking
  step :authorize_user
  step :format_response

  def find_booking(ctx, booking_id:, **)
    ctx[:booking] = Booking.includes(
      :boarding_stop,
      :drop_stop,
      { booking_seats: { trip_seat: :seat, passenger: {} } },
      trip: { route: :route_stops }
    ).find_by(id: booking_id)

    unless ctx[:booking].present?
      ctx[:error] = "Booking not found"
      return false
    end

    true
  rescue => e
    ctx[:error] = "Error finding booking: #{e.message}"
    false
  end

  def authorize_user(ctx, booking:, current_user:, **)
    unless booking.user_id == current_user.id
      ctx[:error] = "Not authorized to view this booking"
      return false
    end

    true
  end

  def format_response(ctx, booking:, **)
    ctx[:booking_data] = booking.as_json(
      include: {
        boarding_stop: {
          only: [:id, :stop_name, :city_name]
        },
        drop_stop: {
          only: [:id, :stop_name, :city_name]
        },
        booking_seats: {
          only: [:seat_price],
          include: {
            trip_seat: {
              only: [:seat_price],
              include: {
                seat: {
                  only: [:seat_number, :seat_type, :deck]
                }
              }
            },
            passenger: {
              only: [:id, :name, :age, :gender]
            }
          }
        },
        trip: {
          only: [:id, :departure_time, :arrival_time, :travel_start_date],
          include: {
            route: {
              only: [:source_city, :destination_city, :total_distance_km],
              include: {
                route_stops: {
                  only: [:id, :stop_name, :city_name, :stop_order]
                }
              }
            }
          }
        }
      }
    )

    true
  rescue => e
    ctx[:error] = "Error formatting booking: #{e.message}"
    false
  end
end