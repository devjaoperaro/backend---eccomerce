'use strict'

const User = use('App/Models/User')
const Role = use('Role')
const Database = use('Database')

class AuthController {
    async register({ request, response }) {
        try {
            const trx = await Database.beginTransaction()

            const { name, surname, email, password } = request.all() // request.body

            const user = await User.create(
                { name, surname, email, password },
                trx
            )

            const userRole = await Role.findBy('slug', 'client')

            // Associa o userRole ao User
            await user.roles().attach([userRole.id])

            await trx.commit()
            return response.status(201).send({ data: user })
        } catch (e) {
            await trx.rollback()
            return response.status(400).send({
                message: 'Erro ao realizar cadastro',
                message: e.message
            })
        }
    }

    async login({ request, response, auth }) {
        const { email, password } = request.all()

        const user = await auth.withRefreshToken().attempt(email, password)

        return response.send({ data: user })
    }

    async refresh({ request, response, auth }) {
        const refresh_token = request.input('refresh_token')

        if (!refresh_token) {
            refresh_token = request.header('refresh_token')
        }

        const user = await auth
            .newRefreshToken()
            .generateForRefreshToken(refresh_token)

        return response.send({ data: user })
    }

    async logout({ request, response, auth }) {
        const refresh_token = request.input('refresh_token')

        if (!refresh_token) {
            refresh_token = request.header('refresh_token')
        }

        const loggedOut = await auth
            .authenticator('jwt')
            .revokeTokens([refresh_token], true)

        return response.send({ message: 'User Logged Out!' })
    }
}

module.exports = AuthController
