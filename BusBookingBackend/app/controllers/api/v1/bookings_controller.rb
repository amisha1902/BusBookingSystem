class Api::V1::BookingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_booking, only: %i[show destroy]

  def create
    result = Booking::Create.call(
      params: booking_params,
      current_user: current_user,
    )

    if result.success?
      render json: {
               success: true,
               booking_id: result[:booking].id,
               seats: result[:locked_seats].map(&:seat_id),
               total_price: result[:total_price],
               payment_id: result[:payment].id,
               status: result[:booking].status,
             }, status: :created
    else
      render json: {
               success: false,
               error: result[:error],
               errors: result[:errors],
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
          travel_date: booking.trip.travel_start_date,
        },
        seats: booking.booking_seats.map do |bs|
          {
            seat_number: bs.trip_seat.seat.seat_number,
            seat_type: bs.trip_seat.seat.seat_type,
            deck: bs.trip_seat.seat.deck,
            price: bs.seat_price,
          }
        end,
      }
    }
  end

  def show
    booking_json = @booking.as_json(
      include: {
        boarding_stop: {
          only: [:id, :stop_name, :city_name],
        },
        drop_stop: {
          only: [:id, :stop_name, :city_name],
        },
        passengers: {
          only: [:id, :name, :age, :gender],
        },
        booking_seats: {
          only: [:seat_price],
          include: {
            trip_seat: {
              only: [:seat_price],
              include: {
                seat: {
                  only: [:seat_number, :seat_type, :deck],
                },
              },
            },
            passenger: {
              only: [:id, :name, :age, :gender],
            },
          },
        },
        trip: {
          only: [:id, :departure_time, :arrival_time, :travel_start_date],
          include: {
            route: {
              only: [:source_city, :destination_city, :total_distance_km],
              include: {
                route_stops: {
                  only: [:id, :stop_name, :city_name, :stop_order],
                },
              },
            },
          },
        },
      },
    )

    render json: booking_json
  end

  def destroy
    result = Booking::Destroy.call(
      booking_id: params[:id],
      current_user: current_user,
    )

    if result.success?
      render json: {
               success: true,
               status: "cancelled",
               message: "Booking cancelled successfully",
             }
    else
      render json: {
               success: false,
               error: result[:error],
             }, status: :unprocessable_entity
    end
  end

  private

  def set_booking
    @booking = Booking.includes(
      :boarding_stop,
      :drop_stop,
      :passengers,
      { booking_seats: { trip_seat: :seat } },
      trip: { route: :route_stops },
    ).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {
             success: false,
             error: "Booking not found",
           }, status: :not_found
  end

  def booking_params
    params.permit(
      :trip_id,
      :boarding_stop_id,
      :drop_stop_id,
      seat_ids: [],
      passengers: [:name, :age, :gender],
    )
  end
end
