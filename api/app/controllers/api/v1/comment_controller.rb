module Api
    module V1
        class CommentController < ApplicationController

            # Listar todos os commentos
			def index
                if params[:topic_id]

                    comments = Comment.where('topic_id = ?', params[:topic_id]).order('created_at DESC');

                    render json: {status: 'SUCCESS', message:'Commentários carregados', data:comments},status: :ok
                else
                    comments = Comment.order('created_at DESC');
                    render json: {status: 'SUCCESS', message:'Commentários carregados', data:comments},status: :ok
                end
			end

            # Inserir comentario
			def create
				comment = Comment.new(comment_params)
				if comment.save
					render json: {status: 'SUCCESS', message:'Saved comment', data:comment},status: :ok
				else
					render json: {status: 'ERROR', message:'Comment not saved', data:comment.erros},status: :unprocessable_entity
				end
			end


			# Parametros
			private
			def comment_params
				params.permit(:topic_id,:text,:user_id,:user_name)
			end
        end
    end
end
