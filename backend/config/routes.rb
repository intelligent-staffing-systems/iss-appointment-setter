Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :appointments, only: [:index]
      post 'process_call', to: 'appointments#process_call'
      get 'get_text_response', to: 'appointments#get_text_response'
    end
  end
end
