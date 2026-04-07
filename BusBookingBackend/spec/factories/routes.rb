FactoryBot.define do
  factory :route do
    source_city { Faker::Address.city }
    destination_city { Faker::Address.city }
    total_distance_km { rand(100..500) }
    is_active { true }
  end
end