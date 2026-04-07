FactoryBot.define do
  factory :seat do
    association :bus
    seat_number { Faker::Alphanumeric.unique.alphanumeric(number: 3).upcase }
    seat_type   { Seat.seat_types.keys.sample }
    deck        { %w[lower upper].sample }
    row_number  { rand(1..10) }
    col_number  { rand(1..4) }
  end
end