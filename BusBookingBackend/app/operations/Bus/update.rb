class Bus::Update < Trailblazer::Operation
  PERMITTED_PARAMS = [:bus_no, :bus_name, :bus_type, :total_seats, :is_active]

  step :find_model
  step :authorize
  step :validate
  step :persist

  def find_model(ctx, params:, bus_operator:, **)
    ctx[:model] = bus_operator.buses.find(params[:id])
  end

  def authorize(ctx, current_user:, **)
    policy = BusPolicy.new(current_user, ctx[:model])
    policy.update?
  end

  def validate(ctx, params:, **)
    puts "=====DEBUGGGGGGGGG================"
    puts "params : #{params[:bus][:bus_type].inspect}"
    permitted = params[:bus].permit(*PERMITTED_PARAMS)
    puts permitted.inspect
    ctx[:model].assign_attributes(permitted)
    puts ctx[:model]
    ctx[:model].valid?
  end

  def persist(ctx, **)
    ctx[:model].save
  end
end