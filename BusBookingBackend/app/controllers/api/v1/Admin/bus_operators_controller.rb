module Api
  module V1
    module Admin
      class BusOperatorsController < Api::V1::BusOperatorsController

        def verify
          bus_operator = BusOperator.find(params[:id])
          authorize bus_operator, :verify?

          bus_operator.update(
            is_verified: true,
            verified_at: Time.current
          )

          render json: {
            message: "Bus operator verified successfully",
            data: bus_operator
          }
        end

      end
    end
  end
end