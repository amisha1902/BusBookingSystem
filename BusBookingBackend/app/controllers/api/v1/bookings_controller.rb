class Api::V1::BookingsController < ApplicationController
  before_action :authenticate_user!

  def create
    Rails.logger.info "Booking params: #{booking_params.inspect}"
    Rails.logger.info "RAW params: #{params.inspect}"
  Rails.logger.info "booking_params: #{booking_params.inspect}"
  Rails.logger.info "seat_ids: #{booking_params[:seat_ids].inspect}"
  Rails.logger.info "seat_ids class: #{booking_params[:seat_ids].class}"


    result = Booking::Create.call(
      params: booking_params,
      current_user: current_user
    )

    if result.success?
      render json: {
        success: true,
        booking_id: result[:booking].id,
        seats: result[:locked_seats].map(&:seat_id),
        total_price: result[:total_price],
        payment_id: result[:payment].id,
        status: result[:booking].status
      }, status: :created
    else
      # Provide detailed error information
      error_message = result[:error] || "Booking creation failed"
      errors = result[:errors] || [error_message]

      Rails.logger.error "Booking creation failed: #{error_message}"

      render json: {
        success: false,
        error: error_message,
        errors: errors
      }, status: :unprocessable_entity
    end
  end

  def index
  bookings = current_user.bookings.includes(:trip, booking_seats: { trip_seat: :seat })

  render json: bookings.map { |booking|
    {
      id: booking.id,
      status: booking.status,
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
end


  def show
  booking = Booking.includes(
    :boarding_stop,
    :drop_stop,
    :passengers,
    { booking_seats: { trip_seat: :seat } },
    trip: { route: :route_stops }
  ).find(params[:id])

  render json: booking.as_json(
    include: {
      boarding_stop: {
        only: [:id, :stop_name, :city_name]
      },
      drop_stop: {
        only: [:id, :stop_name, :city_name]
      },
      passengers: {
        only: [:id, :name, :age, :gender]
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
end

  def cancel
    booking = current_user.bookings.find(params[:id])
    authorize booking, :cancel?

    booking.update!(status: "cancelled")
    booking.trip_seats.update_all(status: "available", locked_by_user: nil, lock_expiry_time: nil)
    booking.payments.last.update!(status: "refunded") if booking.payments.last

    render json: {
      success: true,
      status: "cancelled",
      message: "Booking cancelled successfully"
    }
  rescue => e
    render json: {
      success: false,
      error: e.message
    }, status: :unprocessable_entity
  end

  private

  def booking_params
    params.permit(
      :trip_id,
      :boarding_stop_id,
      :drop_stop_id,
      seat_ids: [],
      passengers: [:name, :age, :gender]
    )
  end
end