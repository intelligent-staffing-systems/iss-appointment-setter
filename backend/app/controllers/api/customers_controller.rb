module Api
    class CustomersController < ApplicationController
      def upload
        user = User.find_by(id: params[:user_id])
  
        if user.nil?
          render json: { status: 'Error', message: 'User not found' }, status: :not_found
          return
        end
  
        customers_data = params[:customers]
  
        # Validate that the customer data is present and in the expected format.
        if customers_data.nil? || !customers_data.is_a?(Array)
          render json: { status: 'Error', message: 'Invalid or missing customer data' }, status: :unprocessable_entity
          return
        end
  
        added_customers = []
        duplicate_customers = []
  
        customers_data.each do |customer_data|
          # Ensure required fields are present and match expected format.
          name = customer_data['name']
          email = customer_data['email']
          phone = customer_data['phone'] ? customer_data['phone'].to_s.gsub(/[^0-9]/, '') : nil
  
          # Validate that name, email, and phone are present.
          if name.blank? || email.blank? || phone.blank?
            duplicate_customers << {
              name: name || 'N/A',
              email: email || 'N/A',
              phone: phone || 'N/A',
              message: 'Missing required fields'
            }
            next
          end
  
          # Find or initialize the customer based on the phone number.
          customer = user.customers.find_or_initialize_by(phone: phone)
          customer.name = name
          customer.email = email
  
          if customer.new_record?
            if customer.save
              added_customers << { name: customer.name, email: customer.email, phone: customer.phone }
            else
              duplicate_customers << {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                message: customer.errors.full_messages.join(', ')
              }
            end
          else
            duplicate_customers << {
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              message: 'This phone number is already associated with another customer'
            }
          end
        end
  
        render json: {
          status: 'Success',
          message: 'Customers processed',
          added_customers: added_customers,
          duplicate_customers: duplicate_customers
        }, status: :ok
      rescue => e
        render json: {
          status: 'Error',
          message: 'Failed to process data',
          error: e.message
        }, status: :unprocessable_entity
      end
    end
  end
  