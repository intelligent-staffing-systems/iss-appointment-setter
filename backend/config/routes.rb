# config/routes.rb
Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  namespace :api do
    resources :users, only: [:create]
    namespace :customers do
      post 'upload', to: 'uploads#create'
      get 'list', to: 'uploads#index' # Add this line for the GET route
    end
  end
end
