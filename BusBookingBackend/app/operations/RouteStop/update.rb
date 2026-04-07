class RouteStop::Update < Trailblazer::Operation
  PERMITTED_PARAMS = [:city_name, :stop_name, :stop_address, :stop_order,
                      :km_from_source, :scheduled_arrival_time,
                      :scheduled_departure_time, :halt_mins,
                      :is_boarding_point, :is_drop_point].freeze

  step :find_stop!
  step :authorize
  step :update_stop!

  def find_stop!(options, params:, **)
    options[:model] = RouteStop.find_by(id: params[:id])
    options[:model].present?
  end

  def authorize(ctx, current_user:, **)
    RouteStopPolicy.new(current_user, ctx[:model]).update?
  end

  def update_stop!(options, params:, **)
    stop = options[:model]
    if stop.update(params[:route_stop].permit(*PERMITTED_PARAMS))
      true
    else
      options[:errors] = stop.errors.full_messages
      false
    end
  end
end
