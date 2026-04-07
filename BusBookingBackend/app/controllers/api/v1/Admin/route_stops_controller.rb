module Api
  module V1
    module Admin
      class RouteStopsController < BaseController

        before_action :set_route_stop, only: [:update, :destroy]

        def index
          result = RouteStop::Index.(params: params, current_user: current_user)
          render json: {
            message: 'Route stops fetched successfully',
            data: result[:models].map { |s| serialize_stop(s) }
          }, status: :ok
        end

        def create
          result = RouteStop::Create.(params: params, current_user: current_user)
          if result.success?
            render json: { message: 'Route stop created successfully', data: serialize_stop(result[:model]) }, status: :created
          else
            render json: { errors: result[:errors] || 'Something went wrong' }, status: :unprocessable_entity
          end
        end

        def update
          result = RouteStop::Update.(params: params, current_user: current_user)
          if result.success?
            render json: { message: 'Route stop updated successfully', data: serialize_stop(result[:model]) }, status: :ok
          else
            render json: { errors: result[:errors] || 'Update failed' }, status: :unprocessable_entity
          end
        end

        def destroy
          result = RouteStop::Destroy.(params: params, current_user: current_user)
          if result.success?
            render json: { message: 'Route stop deleted successfully' }, status: :ok
          else
            render json: { errors: result[:errors] || 'Delete failed' }, status: :unprocessable_entity
          end
        end

        private

        def set_route_stop
          @route_stop = RouteStop.find_by(id: params[:id])
          render json: { errors: 'Stop not found' }, status: :not_found unless @route_stop
        end

        def serialize_stop(stop)
          {
            id: stop.id,
            city_name: stop.city_name,
            stop_name: stop.stop_name,
            stop_address: stop.stop_address,
            stop_order: stop.stop_order,
            km_from_source: stop.km_from_source,
            scheduled_arrival_time: stop.scheduled_arrival_time,
            scheduled_departure_time: stop.scheduled_departure_time,
            halt_mins: stop.halt_mins,
            is_boarding_point: stop.is_boarding_point,
            is_drop_point: stop.is_drop_point
          }
        end
      end
    end
  end
end