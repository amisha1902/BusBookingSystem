class RouteStop::Destroy < Trailblazer::Operation
  step :find_stop!
  step :authorize
  step :destroy_stop!

  def find_stop!(options, params:, **)
    options[:model] = RouteStop.find_by(id: params[:id])
    options[:model].present?
  end

  def authorize(ctx, current_user:, **)
    RouteStopPolicy.new(current_user, ctx[:model]).destroy?
  end

  def destroy_stop!(options, **)
    stop = options[:model]
    if stop.destroy
      true
    else
      options[:errors] = stop.errors.full_messages
      false
    end
  end
end
