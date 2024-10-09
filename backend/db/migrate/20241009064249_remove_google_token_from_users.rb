class RemoveGoogleTokenFromUsers < ActiveRecord::Migration[7.2]
  def change
    remove_column :users, :google_token, :string
  end
end
