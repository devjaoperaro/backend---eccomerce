'use strict'

class UserStoreUser {
    get rules() {
        return {
            email: 'unique:users,email|required',
            image_id: 'exists:images,id'
        }
    }

    get messages() {
        return {
            'email.unique': 'O e-mail já existe!',
            'email.required': 'O campo e-mail é obrigatório',
            'image_id.exists': 'A imagem especificada não existe!'
        }
    }
}

module.exports = UserStoreUser
