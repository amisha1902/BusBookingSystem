module Api
  module V1
    module Auth
      class SessionsController < ApplicationController
        def create
          user = User.find_by(email: params[:user][:email])

          if user&.valid_password?(params[:user][:password])
            token = user.generate_jwt
            render json: {
              message: 'User logged in successfully',
              token: token,
              user: {
                id:    user.id,
                name:  user.name,
                email: user.email,
                role:  user.role
              }
            }, status: :ok
          else
            render json: { error: 'Invalid email or password' }, status: :unauthorized
          end
        end

        def destroy
          render json: { message: 'Logged out successfully' }, status: :ok
        end
      end
    end
  end
end