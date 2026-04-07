FactoryBot.define do
  factory :bus_operator do
    association :user

    company_name { Faker::Company.name }

    sequence(:license_no) { |n| "LIC#{1000 + n}" }

    contact_email { Faker::Internet.email }

    is_verified { false }

    trait :verified do
      is_verified { true }
    end
  end
end