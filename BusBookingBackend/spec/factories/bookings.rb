FactoryBot.define do
  factory :booking do
    user { association :user }
    trip { association :trip }
    boarding_stop { association :route_stop, route: trip.route }
    drop_stop { association :route_stop, route: trip.route }
    status { 'pending' }
    total_price { 1000 }

    trait :with_seats do
      after(:create) do |booking|
        create_list(:booking_seat, 2, booking: booking)
      end
    end
  end
end