FactoryBot.define do
  factory :trip_seat do
    trip { association :trip }
    seat { association :seat, bus: trip.bus }
    seat_price { 100.0 }
    status { 0 } # available
  end
end