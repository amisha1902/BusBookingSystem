Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      namespace :auth do
        post   'passenger/register', to: 'passenger_registrations#create'
        post   'operator/register',  to: 'operator_registrations#create'
        post   'sign_in',            to: 'sessions#create'
        delete 'sign_out',           to: 'sessions#destroy'
      end
    resources :bus_operators, only: [:index, :create, :show, :update, :destroy] do
      resources :buses, only: [:index, :create, :show, :update, :destroy]
    end
    end
  end
end