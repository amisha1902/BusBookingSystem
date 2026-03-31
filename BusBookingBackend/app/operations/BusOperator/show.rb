class BusOperator::Show < Trailblazer::Operation
  step :find_model
  step :authorize

  def find_model(options, params:, **)
    options[:model] = BusOperator.find(params[:id])
  end

  def authorize(options, current_user:, **)
    policy = BusOperatorPolicy.new(current_user, options[:model])
    policy.show?
  end
end
