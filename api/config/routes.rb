Rails.application.routes.draw do
    namespace 'api' do
    	namespace 'v1' do
    		resources :topic
    		resources :user
    		resources :comment
    		resources :rating
    	end
    end
end
