FactoryBot.define do
  factory :booking_seat do
    booking { association :booking }
    trip_seat { association :trip_seat }
    passenger { association :passenger }
    seat_price { 100.0 }
  end
end 