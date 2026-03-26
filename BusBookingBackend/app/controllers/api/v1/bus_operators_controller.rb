module Api
  module V1
    class BusOperatorsController < BaseController
      before_action :set_bus_operator, only: [:show, :update, :destroy]

      def index
        bus_operators = policy_scope(BusOperator)
        render json: {
          message: 'Bus operators fetched successfully',
          data: bus_operators.map { |bo| serialize_bus_operator(bo) }
        }, status: :ok
      end

      def show
        authorize @bus_operator
        render json: {
          message: 'Bus operator fetched successfully',
          data: serialize_bus_operator(@bus_operator)
        }, status: :ok
      end

      def create
        @bus_operator = BusOperator.new(bus_operator_params)
        @bus_operator.user = current_user
        authorize @bus_operator

        if @bus_operator.save
          render json: {
            message: 'Bus operator created successfully',
            data: serialize_bus_operator(@bus_operator)
          }, status: :created
        else
          render json: {
            message: 'Failed to create bus operator',
            errors: @bus_operator.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        authorize @bus_operator

        if @bus_operator.update(bus_operator_params)
          render json: {
            message: 'Bus operator updated successfully',
            data: serialize_bus_operator(@bus_operator)
          }, status: :ok
        else
          render json: {
            message: 'Failed to update bus operator',
            errors: @bus_operator.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        authorize @bus_operator
        @bus_operator.destroy
        render json: { message: 'Bus operator deleted successfully' }, status: :ok
      end

      private

      def set_bus_operator
        @bus_operator = BusOperator.find(params[:id])
      end

      def bus_operator_params
        params.require(:bus_operator).permit(:company_name, :license_no, :contact_email)
      end

      def serialize_bus_operator(bo)
        {
          id:            bo.id,
          company_name:  bo.company_name,
          license_no:    bo.license_no,
          contact_email: bo.contact_email,
          is_verified:   bo.is_verified,
          verified_at:   bo.verified_at,
          owner: {
            id:    bo.user.id,
            name:  bo.user.name,
            email: bo.user.email
          },
          created_at: bo.created_at
        }
      end
    end
  end
end