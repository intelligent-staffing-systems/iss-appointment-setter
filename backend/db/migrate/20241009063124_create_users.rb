class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users, id: :uuid do |t|
      t.string :email
      t.string :provider
      t.string :google_token
      t.string :outlook_token

      t.timestamps
    end
  end
end
