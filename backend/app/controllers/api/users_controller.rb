module Api
  class UsersController < ApplicationController
    def create
      user = User.find_by(email: user_params[:email]) # Check if the user already exists
      if user
        render json: { status: 'User already exists, proceeding with authentication', user: user }, status: :ok
      else
        user = User.new(user_params)
        user.uuid = SecureRandom.uuid # Generate a UUID for the user
        if user.save
          render json: { status: 'User created successfully', user: user }, status: :created
        else
          render json: { status: 'Error', errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :provider, :google_token, :outlook_token)
    end
  end
end
