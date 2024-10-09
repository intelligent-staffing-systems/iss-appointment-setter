class Customer < ApplicationRecord
  validates :phone, uniqueness: { message: 'Phone number already exists' }
end
