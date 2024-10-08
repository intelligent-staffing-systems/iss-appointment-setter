class ReplaceIdWithUuidInUsers < ActiveRecord::Migration[7.2]
  def change
    # Remove the existing `id` column
    remove_column :users, :id

    # Change the `uuid` column to be the primary key
    change_column :users, :uuid, :string, null: false
    execute "ALTER TABLE users ADD PRIMARY KEY (uuid);"
  end
end
