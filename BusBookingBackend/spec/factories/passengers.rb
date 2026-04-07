FactoryBot.define do
  factory :passenger do
    name { Faker::Name.name }
    age { rand(18..65) }
    gender { %w[male female other].sample }
  end
end