module Api
    module V1
        class RatingController < ApplicationController


            def index
				topics = Rating.order('created_at DESC');
				render json: {status: 'SUCCESS', message:'Rating carregados', data:topics},status: :ok
			end

            # Inserir comentario
			def create
				rating = Rating.new(rating_params)
				if rating.save
					render json: {status: 'SUCCESS', message:'Saved rating', data:rating},status: :ok
				else
					render json: {status: 'ERROR', message:'Rating not saved', data:rating.erros},status: :unprocessable_entity
				end
			end


			def destroy
				topic = Rating.find(params[:id])
				topic.destroy
				render json: {status: 'SUCCESS', message:'Deleted rating', data:topic},status: :ok
			end

			# Parametros
			private
			def rating_params
				params.permit(:comment_id, :user_id, :status)
			end
        end
    end
end
