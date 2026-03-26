class Fare < ApplicationRecord
  belongs_to :route

  validates :bus_type, :base_fare_per_km, :min_fare, presence: true
  validates :bus_type, uniqueness: { scope: :route_id }
end
