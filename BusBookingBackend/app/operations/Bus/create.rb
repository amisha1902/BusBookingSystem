class Bus::Create < Trailblazer::Operation
  PERMITTED_PARAMS = [:bus_no, :bus_name, :bus_type, :total_seats].freeze

  step :build_model
  step :assign_bus_operator
  step :authorize
  step :validate
  step :persist

  def build_model(ctx, **)
    ctx[:model] = Bus.new
  end

  def assign_bus_operator(ctx, bus_operator:, **)
    ctx[:model].bus_operator = bus_operator
  end

  def authorize(ctx, current_user:, **)
    policy = BusPolicy.new(current_user, ctx[:model])
    policy.create?
  end

  def validate(ctx, params:, **)
    permitted = params[:bus].permit(*PERMITTED_PARAMS)
    clean_params = permitted.to_h.reject { |_, v| v.nil? || v == '' }
    ctx[:model].assign_attributes(clean_params)
    ctx[:model].valid?
  end

  def persist(ctx, **)
    ctx[:model].save
  end
end