FactoryBot.define do
  factory :trip do
    bus { association :bus }
    route { association :route }
    travel_start_date { 2.days.from_now.to_date }
    departure_time { '08:00' }
    arrival_time { '14:00' }
    status { 'scheduled' }
  end
end