require "rails_helper"

RSpec.describe Payments::Create do
  let(:user) { create(:user, :passenger) }
  let(:operator) { create(:user, :operator) }
  let(:bus_operator) { create(:bus_operator, user: operator) }
  let(:bus) { create(:bus, bus_operator: bus_operator) }
  let(:route) { create(:route) }
  let(:trip) { create(:trip, bus: bus, route: route) }

  let(:booking) do
    create(
      :booking,
      user: user,
      trip: trip,
      total_price: 1000,
      status: :pending,
    )
  end

  let!(:trip_seats) do
    seats = create_list(:trip_seat, 2, trip: trip, status: :locked)
    seats.each do |seat|
      create(:booking_seat, trip_seat: seat, booking: booking)
    end
  end

  let(:params) do
    {
      booking_id: booking.id,
    }
  end

  subject { described_class.call(params: params, current_user: user) }

  describe "#create_payment" do
    it "creates a payment record" do
      expect { subject }.to change(Payment, :count).by(1)
    end

    it "sets correct payment amount" do
      subject
      expect(Payment.last.amount).to eq(booking.total_price)
    end

    it "sets payment status to success after processing" do
      subject
      expect(Payment.last.status).to eq("success")
    end

    it "associates payment with booking" do
      subject
      expect(Payment.last.booking_id).to eq(booking.id)
    end
  end

  describe "#process_payment" do
    it "confirms booking after payment success" do
      subject
      expect(booking.reload.status).to eq("confirmed")
    end

    it "marks seats as booked" do
      subject
      expect(trip_seats.first.reload.status).to eq("booked")
    end
  end

  context "when payment processing fails" do
    before do
      allow_any_instance_of(Payment).to receive(:update!)
                                          .and_raise(StandardError)
    end

    it "returns failure" do
      expect(subject).not_to be_success
    end

    it "releases locked seats" do
      subject
      expect(trip_seats.first.reload.status).to eq(0)
    end
  end

  context "when booking does not exist" do
    let(:params) { { booking_id: 9999 } }

    it "fails the operation" do
      expect(subject).not_to be_success
    end
  end
end
