class RemoveOutlookTokenFromUsers < ActiveRecord::Migration[7.2]
  def change
    remove_column :users, :outlook_token, :string
  end
end
