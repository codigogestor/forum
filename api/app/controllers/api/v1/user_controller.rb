module Api
    module V1
        class UserController < ApplicationController

            # Listar todos os usuarios
			def index

                if params[:email]
                    user = User.where("email = ?", params[:email])
                    if user.empty?
                        render json: {status: 'ERROR', message:'Usuário não encontrado!'},status: :ok
                    else
                        render json: {status: 'SUCCESS', message:'Usuário encontrado!', data:user},status: :ok
                    end
                else
                    users = User.order('created_at DESC');
                    render json: {status: 'SUCCESS', message:'Usuários carregados', data:users},status: :ok
                end


			end

            # Listar User pelo ID
			def show
			    user = User.find(params[:id]);
			    render json: {status: 'SUCCESS', message:'Loaded user', data:user},status: :ok
			end

            # Criar um novo usuario
			def create

                if params[:email]
                    user = User.where("email = ?", params[:email])
                    if user.empty?
                        user = User.new(user_params)
        				if user.save
        					render json: {status: 'SUCCESS', message:'Saved user', data:user},status: :ok
        				else
        					render json: {status: 'ERROR', message:'User not saved', data:user.erros},status: :unprocessable_entity
        				end
                    else
                        render json: {status: 'ERROR', message:'E-mail já esta cadastrado!', data:user},status: :ok
                    end
                else
                    render json: {status: 'ERROR', message:'Usuário não informado'},status: :unprocessable_entity
                end

			end

            # Excluir usuario
			def destroy
				user = User.find(params[:id])
				user.destroy
				render json: {status: 'SUCCESS', message:'Deleted user', data:user},status: :ok
			end

            # Atualizar um usuario
			def update
				user = User.find(params[:id])
				if user.update_attributes(user_params)
					render json: {status: 'SUCCESS', message:'Updated user', data:user},status: :ok
				else
					render json: {status: 'ERROR', message:'Articles not update', data:user.erros},status: :unprocessable_entity
				end
			end
			# Parametros aceitos
			private
			def user_params
				params.permit(:name,:email)
			end
        end
    end
end
