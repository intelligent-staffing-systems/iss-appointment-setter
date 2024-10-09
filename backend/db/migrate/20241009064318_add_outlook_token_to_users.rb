class AddOutlookTokenToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :outlook_token, :string
  end
end
