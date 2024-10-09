Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :customers do
      post 'upload', to: 'uploads#create'
    end

    resources :users, only: [:create]
  end
end
