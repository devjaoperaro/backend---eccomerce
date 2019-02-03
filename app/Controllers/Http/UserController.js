'use strict'

const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/User/UserTransformer')

class UserController {
    async me({ response, transform, auth }) {
        let user = await auth.getUser()
        user = await transform.item(user, UserTransformer)
        user.roles = await user.getRoles()
        return response.send(user)
    }
}

module.exports = UserController
