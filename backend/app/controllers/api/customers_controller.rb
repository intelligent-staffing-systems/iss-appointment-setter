module Api
    class CustomersController < ApplicationController
      def upload
        # Find the user by the provided user_id.
        user = User.find_by(id: params[:user_id])
  
        if user.nil?
          render json: { status: 'Error', message: 'User not found' }, status: :not_found
          return
        end
  
        customers_data = params[:customers]
  
        # Check if customer data is provided and is an array.
        if customers_data.nil? || !customers_data.is_a?(Array)
          render json: { status: 'Error', message: 'Invalid or missing customer data' }, status: :unprocessable_entity
          return
        end
  
        customers = []
  
        # Iterate through each customer in the data array.
        customers_data.each do |customer_data|
          customer = user.customers.new(
            name: customer_data['name'],
            email: customer_data['email'],
            phone: customer_data['phone']
          )
  
          if customer.save
            customers << customer
          else
            render json: {
              status: 'Error',
              message: 'Failed to save some customers',
              errors: customer.errors.full_messages
            }, status: :unprocessable_entity
            return
          end
        end
  
        render json: {
          status: 'Success',
          message: 'Customers uploaded successfully',
          customers: customers
        }, status: :created
      rescue => e
        render json: {
          status: 'Error',
          message: 'Failed to process data',
          error: e.message
        }, status: :unprocessable_entity
      end
    end
  end
  