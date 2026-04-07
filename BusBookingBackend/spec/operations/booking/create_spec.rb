require 'rails_helper'

RSpec.describe Booking::Create do
  let(:user) { create(:user, :passenger) }
  let(:operator) { create(:user, :operator) }
  let(:bus_operator) { create(:bus_operator, user: operator) }
  let(:bus) { create(:bus, bus_operator: bus_operator) }
  let(:route) { create(:route) }
  let(:trip) { create(:trip, bus: bus, route: route) }
  let!(:trip_seats) { create_list(:trip_seat, 10, trip: trip, status: 0) }
  let(:boarding_stop) { create(:route_stop, route: route, km_from_source: 0) }
  let(:drop_stop) { create(:route_stop, route: route, km_from_source: 100) }

  let(:passengers_data) do
    [
      { name: 'John Doe', age: 25, gender: 'male' },
      { name: 'Jane Smith', age: 30, gender: 'female' }
    ]
  end

  let(:params) do
    {
      trip_id: trip.id,
      seat_ids: [],
      boarding_stop_id: boarding_stop.id,
      drop_stop_id: drop_stop.id,
      passengers: passengers_data
    }
  end

  subject { described_class.call(params: params, current_user: user) }

  def available_seats(count = 2)
    trip.trip_seats.where(status: 0).limit(count).pluck(:id)
  end

  describe '#call - Happy Path' do
    before { params[:seat_ids] = available_seats(2) }

    it 'creates a booking with correct attributes' do
       puts "TripSeats count: #{trip.trip_seats.count}"
       puts "Available seats: #{available_seats(2)}"
      subject
      booking = Booking.last
      expect(booking.user_id).to eq(user.id)
      expect(booking.trip_id).to eq(trip.id)
      expect(booking.boarding_stop_id).to eq(boarding_stop.id)
      expect(booking.drop_stop_id).to eq(drop_stop.id)
      expect(booking.status).to eq('pending')
    end

    it 'creates booking seats for each passenger' do
      subject
      booking = Booking.last
      expect(booking.booking_seats.count).to eq(passengers_data.count)
    end

    it 'creates passengers' do
      subject
      expect(Passenger.count).to eq(passengers_data.count)
    end
  end

  describe '#create_booking - Booking Creation' do
    before { params[:seat_ids] = available_seats(2) }

    it 'creates booking with pending status' do
      subject
      expect(Booking.last.status).to eq('pending')
    end

    context 'when booking creation fails' do
      before { allow(Booking).to receive(:create!).and_raise(StandardError, 'DB error') }

      it 'returns failure' do
        expect(subject).not_to be_success
      end
    end
  end

  describe '#create_booking_seats - Passenger Validation' do
    before { params[:seat_ids] = available_seats(2) }

    it 'creates passenger with correct attributes' do
      subject
      passenger = Passenger.first
      expect(passenger.name).to eq(passengers_data[0][:name])
    end

    it 'pairs passengers with seats in order' do
      params[:seat_ids] = available_seats(2)
      subject
      booking = Booking.last
      booking.booking_seats.each_with_index do |bs, index|
        expect(bs.passenger.name).to eq(passengers_data[index][:name])
      end
    end
  end
end
