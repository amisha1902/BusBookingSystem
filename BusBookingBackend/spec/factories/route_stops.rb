FactoryBot.define do
  factory :route_stop do
    association :route
    sequence(:stop_order) { |n| n }
    city_name { Faker::Address.city }
    stop_name { "#{Faker::Address.street_name} Bus Stop" }
    stop_address { Faker::Address.full_address }
    km_from_source { rand(10..500) }
    scheduled_arrival_time { "09:00" }
    scheduled_departure_time { "09:10" }
    halt_mins { rand(5..20) }
    is_boarding_point { true }
    is_drop_point { true }
    trait :boarding_only do
      is_drop_point { false }
    end
    trait :drop_only do
      is_boarding_point { false }
    end
  end
end