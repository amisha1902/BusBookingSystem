class BusOperator::Update < Trailblazer::Operation
    PERMITTED_PARAMS = [:company_name, :license_no, :contact_email]
  step :find_model
  step :authorize
  step :validate
  step :persist

  def find_model(ctx, params:, **)
    ctx[:model] = BusOperator.find(params[:id])
  end

  def authorize(ctx, current_user:, **)
    policy = BusOperatorPolicy.new(current_user, ctx[:model])
    policy.update?
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
