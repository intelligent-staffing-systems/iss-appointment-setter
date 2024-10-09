class CreateCustomers < ActiveRecord::Migration[7.2]
  def change
    enable_extension 'uuid-ossp' unless extension_enabled?('uuid-ossp')

    create_table :customers, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :name
      t.string :email
      t.string :phone

      t.timestamps
    end
  end
end
