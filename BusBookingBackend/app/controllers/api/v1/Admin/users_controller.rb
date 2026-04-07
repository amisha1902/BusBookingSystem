module Api
  module V1
    module Admin
      class UsersController < ApplicationController
        before_action :set_user, only: [:show, :update, :destroy]
        before_action :authenticate_user!
        before_action :authorize_admin!

        def index
          users = User.all
          if params[:search].present?
            users = users.where("name ILIKE ? OR email ILIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
          end
          if params[:role].present?
            users = users.where(role: params[:role])
          end
          render json: {
            message: "Users fetched successfully",
            data: users.as_json(only: [:id, :name, :email, :phone, :role, :is_active, :created_at]),
          }
        end

        def show
          render json: {
            message: "User fetched successfully",
            data: @user.slice(:id, :email, :role, :created_at),
          }
        end

        def update
          if @user.update(user_params)
            render json: {
              message: "User updated successfully",
              data: @user,
            }
          else
            render json: {
              errors: @user.errors.full_messages,
            }, status: :unprocessable_entity
          end
        end

        def destroy
          @user.destroy

          render json: {
            message: "User deleted successfully",
          }
        end

        def update_status
          user = User.find(params[:id])

          user.update(is_active: params[:is_active])

          render json: {
                   message: "User status updated",
                   data: user,
                 }
        end

        private

        def set_user
          @user = User.find(params[:id])
        end

        def user_params
          params.require(:user).permit(:email, :role)
        end

        def authorize_admin!
          unless current_user&.role == "admin"
            render json: { error: "Unauthorized" }, status: :forbidden
          end
        end
      end
    end
  end
end
