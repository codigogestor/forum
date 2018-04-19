module Api
    module V1
        class TopicController < ApplicationController

            # Listar todos os topicos
			def index
				topics = Topic.order('created_at DESC');
				render json: {status: 'SUCCESS', message:'Tópicos carregados', data:topics},status: :ok
			end

            # Listar Topico pelo ID
			def show
				topic = Topic.find(params[:id]);
				render json: {status: 'SUCCESS', message:'Loaded topic', data:topic},status: :ok
			end

            # Criar um novo Tópico
			def create
				topic = Topic.new(topic_params)
				if topic.save
					render json: {status: 'SUCCESS', message:'Saved topic', data:topic},status: :ok
				else
					render json: {status: 'ERROR', message:'Topic not saved', data:topic.erros},status: :unprocessable_entity
				end
			end

            # Excluir Tópico
			def destroy
				topic = Topic.find(params[:id])
				topic.destroy
				render json: {status: 'SUCCESS', message:'Deleted topic', data:topic},status: :ok
			end

            # Atualizar um tópico
			def update
				topic = Topic.find(params[:id])
				if topic.update_attributes(topic_params)
					render json: {status: 'SUCCESS', message:'Updated topic', data:topic},status: :ok
				else
					render json: {status: 'ERROR', message:'Articles not update', data:topic.erros},status: :unprocessable_entity
				end
			end
			# Parametros aceitos
			private
			def topic_params
				params.permit(:title, :description, :tag, :user_id, :user_name)
			end
        end
    end
end
