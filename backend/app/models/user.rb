# app/models/user.rb
class User < ApplicationRecord
    has_many :customers, dependent: :destroy
  end
  