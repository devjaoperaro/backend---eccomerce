'use strict'

const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/User/UserTransformer')

class UserController {
    async me({ request, response, transform, auth }) {
        const user = await auth.getUser()
        return response.send(await transform.item(user, UserTransformer))
    }
}

module.exports = UserController
