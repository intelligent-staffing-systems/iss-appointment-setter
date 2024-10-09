module Api
    module Customers
      class UploadsController < ActionController::API
        def create
          Rails.logger.info "Received customers: #{params[:customers].inspect}"
          customers = params[:customers]
  
          # Validate input data
          if customers.blank? || !customers.is_a?(Array)
            Rails.logger.error "Invalid data format: #{customers}"
            return render json: { error: 'Invalid data format' }, status: :unprocessable_entity
          end
  
          errors = []
          successful_saves = []
  
          customers.each do |customer_data|
            # Log each customer data
            Rails.logger.info "Processing customer: #{customer_data.inspect}"
  
            # Check for duplicates
            existing_customer = Customer.find_by(phone: customer_data[:phone])
  
            if existing_customer
              errors << {
                phone: customer_data[:phone],
                message: "Duplicate phone number. Customer with this phone already exists."
              }
            else
              customer = Customer.new(
                first_name: customer_data[:first_name],
                last_name: customer_data[:last_name],
                email: customer_data[:email],
                phone: customer_data[:phone]
              )
  
              if customer.save
                successful_saves << customer
              else
                errors << {
                  phone: customer_data[:phone],
                  message: "Failed to save customer. #{customer.errors.full_messages.join(', ')}"
                }
              end
            end
          end
  
          # Return a response based on the outcome
          if errors.empty?
            render json: { message: 'All customers uploaded successfully', saved_customers: successful_saves }, status: :created
          else
            render json: {
              message: 'Some customers could not be uploaded due to duplicate phone numbers or other errors.',
              errors: errors,
              saved_customers: successful_saves
            }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error "Error processing upload: #{e.message}"
          render json: { error: e.message }, status: :internal_server_error
        end
      end
    end
  end
  