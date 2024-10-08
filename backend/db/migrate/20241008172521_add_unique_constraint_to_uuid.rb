class AddUniqueConstraintToUuid < ActiveRecord::Migration[7.2]
  def change
    add_index :users, :uuid, unique: true
  end
end


