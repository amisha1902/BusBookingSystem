FactoryBot.define do
  factory :bus do
    bus_no { Faker::Vehicle.license_plate }
    bus_name { "Test Bus" }
    bus_type { "ac_seater" }
    deck { 1 }
    is_active { true }
    total_seats { 30 }

    association :bus_operator
  end
end