class Bus::Destroy < Trailblazer::Operation
  step :find_model
  step :authorize
  step :destroy

  def find_model(options, params:, bus_operator:, **)
    options[:model] = bus_operator.buses.find(params[:id])
  end

  def authorize(options, current_user:, **)
    policy = BusPolicy.new(current_user, options[:model])
    policy.destroy?
  end

  def destroy(options, **)
    options[:model].destroy
  end
end
