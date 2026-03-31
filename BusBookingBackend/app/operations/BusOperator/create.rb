class BusOperator::Create < Trailblazer::Operation
  PERMITTED_PARAMS = [:company_name, :license_no, :contact_email]

  step :build_model
  step :assign_user
  step :authorize
  step :validate
  step :persist

  def build_model(ctx, params:, **)
    ctx[:model] = BusOperator.new
  end

  def authorize(ctx, current_user:, **)
    policy = BusOperatorPolicy.new(current_user, ctx[:model])
    policy.create?
  end

  def assign_user(ctx, current_user:, **)
    ctx[:model].user = current_user
  end

  def validate(ctx, params:, **)
    permitted = params[:bus_operator].permit(*PERMITTED_PARAMS)
    ctx[:model].assign_attributes(permitted)
    ctx[:model].valid?
  end

  def persist(ctx, **)
    ctx[:model].save
  end
end
