class BusOperator::Destroy < Trailblazer::Operation
  step :find_model
  step :authorize
  step :destroy

  def find_model(options, params:, **)
    options[:model] = BusOperator.find(params[:id])
  end

  def authorize(options, current_user:, **)
    policy = BusOperatorPolicy.new(current_user, options[:model])
    policy.destroy?
  end

  def destroy(options, **)
    options[:model].destroy
  end
end
