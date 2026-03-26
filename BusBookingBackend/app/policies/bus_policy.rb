class BusPolicy < ApplicationPolicy
  def create?
    user.operator? && 
    user.bus_operator.present? &&
    user.bus_operator.is_verified? &&
    record.bus_operator_id == user.bus_operator.id
  end

  def show?    = true
  def index?   = true

  def update?  = user.admin? || owned_by_operator?
  def destroy? = user.admin? || owned_by_operator?

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      elsif user.operator?
        scope.where(bus_operator_id: user.bus_operator&.id)
      else
        scope.active
      end
    end
  end

  private

  def owned_by_operator?
    user.operator? && record.bus_operator_id == user.bus_operator&.id
  end
end