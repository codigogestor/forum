class CreateTopics < ActiveRecord::Migration[5.2]
  def change
    create_table :topics do |t|
      t.string :title
      t.string :description
      t.string :tag
      t.string :user_id
      t.string :user_name

      t.timestamps
    end
  end
end
