FactoryBot.define do
  factory :payment do
    booking { association :booking }
    amount { 1000.0 }
    status { :pending }
  end
end