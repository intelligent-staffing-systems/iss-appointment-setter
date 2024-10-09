# app/models/customer.rb
class Customer < ApplicationRecord
  belongs_to :user
end
