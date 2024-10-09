# app/models/customer.rb
class Customer < ApplicationRecord
  belongs_to :user

  # Normalize the phone number before saving
  before_save :normalize_phone

  # Validate presence of name, email, and phone
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, presence: true, uniqueness: { scope: :user_id, message: 'This phone number is already associated with a customer for this user' }

  private

  # Method to normalize phone numbers (remove special characters)
  def normalize_phone
    self.phone = phone.gsub(/[^0-9]/, '') if phone.present?
  end
end
