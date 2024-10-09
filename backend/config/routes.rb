Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :users, only: [:create]
    
    resources :customers, only: [] do
      collection do
        post :upload
      end
    end
  end
end
