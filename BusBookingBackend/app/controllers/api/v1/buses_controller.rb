module Api
  module V1
    class BusesController < BaseController
      before_action :set_bus_operator
      before_action :set_bus, only: [:show, :update, :destroy]

      def index
        buses = policy_scope(Bus).where(bus_operator_id: @bus_operator.id)
        render json: {
          message: 'Buses fetched successfully',
          data: buses.map { |bus| serialize_bus(bus) }
        }, status: :ok
      end

      def show
        authorize @bus
        render json: {
          message: 'Bus fetched successfully',
          data: serialize_bus(@bus)
        }, status: :ok
      end

      def create
        @bus = Bus.new(bus_params)
        @bus.bus_operator = @bus_operator
        authorize @bus

        if @bus.save
          render json: {
            message: 'Bus created successfully',
            data: serialize_bus(@bus)
          }, status: :created
        else
          render json: {
            message: 'Failed to create bus',
            errors: @bus.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        authorize @bus

        if @bus.update(bus_params)
          render json: {
            message: 'Bus updated successfully',
            data: serialize_bus(@bus)
          }, status: :ok
        else
          render json: {
            message: 'Failed to update bus',
            errors: @bus.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        authorize @bus
        @bus.destroy
        render json: { message: 'Bus deleted successfully' }, status: :ok
      end

      private

      def set_bus_operator
        @bus_operator = BusOperator.find(params[:bus_operator_id])
      end

      def set_bus
        @bus = @bus_operator.buses.find(params[:id])
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