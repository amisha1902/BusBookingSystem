FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    phone { Faker::PhoneNumber.cell_phone }
    password { 'password123' }
    role { 'passenger' }

    trait :admin do
      role { 'admin' }
    end

    trait :operator do
      role { 'operator' }
    end

    trait :passenger do
      role { 'passenger' }
    end
  end
end