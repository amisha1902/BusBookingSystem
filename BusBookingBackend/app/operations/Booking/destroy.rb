class Booking::Destroy < Trailblazer::Operation
  step :find_booking
  step :authorize_user
  step :cancel_booking
  step :unlock_seats
  step :process_refund
  fail :collect_errors

  def find_booking(ctx, booking_id:, **)
    ctx[:booking] = Booking.find_by(id: booking_id)

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
      ctx[:error] = "Not authorized to cancel this booking"
      return false
    end

    if booking.cancelled?
      ctx[:error] = "Booking is already cancelled"
      return false
    end

    true
  end

  def cancel_booking(ctx, booking:, **)
    begin
      booking.update!(status: :cancelled)
      true
    rescue => e
      ctx[:error] = "Error cancelling booking: #{e.message}"
      false
    end
  end

  def unlock_seats(ctx, booking:, **)
    begin
      booking.trip_seats.update_all(
        status: 0,
        locked_by_user: nil,
        lock_expiry_time: nil
      )
      true
    rescue => e
      ctx[:error] = "Error unlocking seats: #{e.message}"
      false
    end
  end

  def process_refund(ctx, booking:, **)
    begin
      last_payment = booking.payments.order(created_at: :desc).first

      if last_payment.present?
        last_payment.update!(status: :refunded)
      end

      true
    rescue => e
      ctx[:error] = "Error processing refund: #{e.message}"
      false
    end
  end

  def collect_errors(ctx, error:, **)
    ctx[:errors] = Array(error)
  end
end