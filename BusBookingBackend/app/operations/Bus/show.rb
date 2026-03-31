class Bus::Show < Trailblazer::Operation
  step :find_model
  step :authorize

  def find_model(options, params:, bus_operator:, **)
    options[:model] = bus_operator.buses.find(params[:id])
  end

  def authorize(options, current_user:, **)
    policy = BusPolicy.new(current_user, options[:model])
    policy.show?
  end
end
