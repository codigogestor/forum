class Tag < ApplicationRecord
    validates :topic_id, presence: true
	validates :tag_name, presence: true
end
