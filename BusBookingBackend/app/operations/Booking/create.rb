class Booking::Create < Trailblazer::Operation
  step :find_trip
  step :lock_seats
  step :calculate_total
  step :create_booking
  step :create_booking_seats
  step :create_payment
  # step :return_data
  fail :release_locks_on_failure
  fail :collect_errors

  def find_trip(ctx, params:, **)
    ctx[:trip] = Trip.find_by(id: params[:trip_id])

    unless ctx[:trip].present?
      ctx[:error] = "Trip not found with ID: #{params[:trip_id]}"
      return false
    end

    true
  end

  def lock_seats(ctx, params:, trip:, current_user:, **)
    seat_ids = Array(params[:seat_ids])
    # binding.pry
    unless seat_ids.any?
      ctx[:error] = "No seats selected"
      return false
    end
    # finding all requested seats
    requested = trip.trip_seats.where(id: seat_ids)
    # verifying all requested seats if they exist
    if requested.count != seat_ids.count
      missing_ids = seat_ids - requested.pluck(:id)
      ctx[:error] = "Seats #{missing_ids.join(", ")} not found on this trip"
      return false
    end

    # check the availability
    available_requested = requested.where(status: 0)

    if available_requested.count != seat_ids.count
      unavailable_ids = requested.where.not(id: available_requested.pluck(:id)).pluck(:id)
      ctx[:error] = "Seats #{unavailable_ids.join(", ")} are already taken or locked"
      return false
    end

    # lock the available seats
    available_requested.update_all(
      status: 1,
      locked_by_user: current_user.id,
      lock_expiry_time: 15.minutes.from_now,
    )

    # reloading the locked seats as the status has chnagedd
    ctx[:locked_seats] = trip.trip_seats.where(id: seat_ids).to_a
    true
  rescue => e
    ctx[:error] = "Error locking seats: #{e.message}"
    false
  end

  def calculate_total(ctx, trip:, params:, locked_seats:, **)
    boarding = RouteStop.find_by(id: params[:boarding_stop_id])
    drop = RouteStop.find_by(id: params[:drop_stop_id])

    unless boarding && drop
      ctx[:error] = "Invalid boarding or drop point selected"
      return false
    end

    # calculate the distance yiu travelled based on the stop points you select
    dist_boarding = boarding.km_from_source.to_i
    dist_drop = drop.km_from_source.to_i
    distance_travelled = (dist_drop - dist_boarding).abs
    ctx[:distance] = distance_travelled

    total = 0
    locked_seats.each do |seat|
      base_multiplier = seat.seat_price.to_f / trip.route.total_distance_km
      # seat_price was originally full‑route fare, so divide by total distance to get per‑km rate
      seat_total = base_multiplier * distance_travelled

      if seat_total <= 0
        ctx[:error] = "Invalid seat price for seat #{seat.seat_id}"
        return false
      end

      total += seat_total
    end

    ctx[:total_price] = total.round(2)
    true
  rescue => e
    ctx[:error] = "Error calculating total: #{e.message}"
    false
  end

  def create_booking(ctx, current_user:, trip:, params:, total_price:, **)
    begin
      ctx[:booking] = Booking.create!(
        user: current_user,
        trip: trip,
        boarding_stop_id: params[:boarding_stop_id],
        drop_stop_id: params[:drop_stop_id],
        total_price: total_price,
        status: :pending,
      )
      true
    rescue => e
      ctx[:error] = "Error creating booking: #{e.message}"
      false
    end
  end

  def create_booking_seats(ctx, booking:, locked_seats:, params:, **)
    passengers = Array(params[:passengers])

    # verify passenger count matches seat count
    if passengers.count != locked_seats.count
      ctx[:error] = "Passenger count (#{passengers.count}) must match seat count (#{locked_seats.count})"
      return false
    end

    begin
      passengers.zip(locked_seats).each_with_index do |(passenger_params, trip_seat), index|
        # validate passenger data
        unless passenger_params[:name].present?
          ctx[:error] = "Passenger #{index + 1}: Name is required"
          return false
        end

        unless passenger_params[:age].present? && passenger_params[:age].to_i > 0
          ctx[:error] = "Passenger #{index + 1}: Valid age is required"
          return false
        end

        unless passenger_params[:gender].present?
          ctx[:error] = "Passenger #{index + 1}: Gender is required"
          return false
        end

        # create passenger record
        passenger = Passenger.create!(
          name: passenger_params[:name],
          age: passenger_params[:age],
          gender: passenger_params[:gender],
        ) 

        # reate booking seat record
        BookingSeat.create!(
          booking: booking,
          trip_seat: trip_seat,
          passenger: passenger,
          seat_price: trip_seat.seat_price,
        )
      end

      true
    rescue => e
      ctx[:error] = "Error creating booking seats: #{e.message}"
      false
    end
  end

  def create_payment(ctx, booking:, total_price:, **)
    begin
      ctx[:payment] = Payment.create!(
        booking: booking,
        amount: total_price,
        status: :pending,
      )
      true
    rescue => e
      ctx[:error] = "Error creating payment: #{e.message}"
      false
    end
  end

  def release_locks_on_failure(ctx, trip:, current_user:, **)
    # release seat locks on failure
    trip.trip_seats.where(
      locked_by_user: current_user.id,
      status: 1,
    ).update_all(
      status: 0, 
      locked_by_user: nil,
      lock_expiry_time: nil,
    )
  end

  def collect_errors(ctx, error:, **)
    # collect all error messages
    ctx[:errors] = Array(error)
  end
end
