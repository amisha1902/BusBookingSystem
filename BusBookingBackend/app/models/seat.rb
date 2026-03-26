class Seat < ApplicationRecord
  belongs_to :bus
  has_many   :trip_seats, dependent: :destroy

  enum :seat_type, { window: 'window', aisle: 'aisle', sleeper: 'sleeper' }
  enum :deck,      { lower: 'lower',   upper: 'upper' }

  validates :seat_number, :seat_type, :deck, presence: true
  validates :seat_number, uniqueness: { scope: :bus_id }
end