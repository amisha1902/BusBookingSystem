class Bus < ApplicationRecord
  belongs_to :bus_operator
  has_many :seats, dependent: :destroy
  has_many :trips, dependent: :destroy
  BUS_TYPES = %w[ac_seater non_ac_seater ac_sleeper non_ac_sleeper].freeze
  enum :bus_type, BUS_TYPES, prefix: false
  validates :bus_no, :bus_name, :bus_type, :total_seats, presence: true
  validates :bus_no, uniqueness: true
  validates :total_seats, numericality: { greater_than: 0 }

  scope :active, -> { where(is_active: true) }
end
