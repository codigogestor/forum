class CreateRatings < ActiveRecord::Migration[5.2]
  def change
    create_table :ratings do |t|
      t.string :comment_id
      t.string :user_id
      t.string :status

      t.timestamps
    end
  end
end
