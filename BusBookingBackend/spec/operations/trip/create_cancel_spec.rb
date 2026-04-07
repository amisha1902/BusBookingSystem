require 'rails_helper'

RSpec.describe Booking::Create do
  let(:user) { create(:user, :passenger) }
  let(:operator) { create(:user, :operator) }
  let(:bus_operator) { create(:bus_operator, user: operator) }
  let(:bus) { create(:bus, bus_operator: bus_operator) }
  let(:route) { create(:route) }
  let(:trip) { create(:trip, bus: bus, route: route) }
  let(:boarding_stop) { create(:route_stop, route: route, km_from_source: 0) }
  let(:drop_stop) { create(:route_stop, route: route, km_from_source: 100) }

  let(:params) do
    {
      trip_id: trip.id,
      seat_ids: [],
      boarding_stop_id: boarding_stop.id,
      drop_stop_id: drop_stop.id,
      passengers: [{ name: 'John Doe', age: 25, gender: 'male' }]
    }
  end

  subject { described_class.call(params: params, current_user: user) }

  def available_seats(count = 2)
    trip.trip_seats.where(status: 0).limit(count).pluck(:id)
  end

  describe '#find_trip - Trip Not Found' do
    before { params[:trip_id] = 99999 }

    it 'returns failure' do
      expect(subject).not_to be_success
    end

    it 'has error message' do
      subject
      expect(subject[:error]).to include('Trip not found')
    end
  end

  describe '#lock_seats - Seat Selection' do
    before { params[:seat_ids] = available_seats(2) }

    it 'locks the selected seats' do
      subject
      locked_seats = trip.trip_seats.where(id: params[:seat_ids])
      expect(locked_seats.all? { |ts| ts.status == 1 }).to be true
    end
  end

  describe '#calculate_total - Price Calculation' do
    before { params[:seat_ids] = available_seats(2) }

    it 'calculates based on distance travelled' do
      subject
      distance = (drop_stop.km_from_source - boarding_stop.km_from_source).abs
      expect(subject[:distance]).to eq(distance)
      expect(subject[:total_price]).to be > 0
    end
  end
end
