module Api
  module V1
    class BusesController < BaseController
      before_action :set_bus_operator, only: [:index, :show, :create, :update, :destroy]

      def index
        result = Bus::Index.call(bus_operator: @bus_operator, current_user: current_user)
        render json: {
          message: 'Buses fetched successfully',
          data: result[:models].map { |bus| serialize_bus(bus) }
        }, status: :ok
      end

      def show
        result = Bus::Show.call(params: params, bus_operator: @bus_operator, current_user: current_user)
        if result.success?
          render json: {
            message: 'Bus fetched successfully',
            data: serialize_bus(result[:model])
          }, status: :ok
        else
          render json: { message: 'Unauthorized' }, status: :forbidden
        end
      end

      def create
        result = Bus::Create.call(params: params, bus_operator: @bus_operator, current_user: current_user)
        if result.success?
          render json: {
            message: 'Bus created successfully',
            data: serialize_bus(result[:model])
          }, status: :created
        else
          render json: {
            message: 'Failed to create bus',
            errors: result[:model].errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        result = Bus::Update.call(params: params, bus_operator: @bus_operator, current_user: current_user)
        if result.success?
          render json: {
            message: 'Bus updated successfully',
            data: serialize_bus(result[:model])
          }, status: :ok
        else
          render json: {
            message: 'Failed to update bus',
            errors: result[:model].errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        result = Bus::Destroy.call(params: params, bus_operator: @bus_operator, current_user: current_user)
        if result.success?
          render json: { message: 'Bus deleted successfully' }, status: :ok
        else
          render json: { message: 'Unauthorized' }, status: :forbidden
        end
      end

      private

      def set_bus_operator
        @bus_operator = BusOperator.find(params[:bus_operator_id])
      end

      def bus_params
        params.require(:bus).permit(:bus_no, :bus_name, :bus_type, :total_seats, :is_active)
      end

      def serialize_bus(bus)
        {
          id:           bus.id,
          bus_no:       bus.bus_no,
          bus_name:     bus.bus_name,
          bus_type:     bus.bus_type,
          total_seats:  bus.total_seats,
          is_active:    bus.is_active,
          bus_operator: {
            id:           bus.bus_operator.id,
            company_name: bus.bus_operator.company_name
          },
          created_at: bus.created_at
        }
      end
    end
  end
end