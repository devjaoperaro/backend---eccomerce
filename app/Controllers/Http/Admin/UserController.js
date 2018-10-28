'use strict'

const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/User/UserTransformer')
/**
 * Resourceful controller for interacting with users
 */
class UserController {
    /**
     * Show a list of all users.
     * GET users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ transform, pagination }) {
        const users = await User.query().paginate(
            pagination.page,
            pagination.perpage
        )
        return transform.paginate(users, UserTransformer)
    }

    /**
     * Create/save a new user.
     * POST users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response, transform }) {
        const data = request.only([
            'name',
            'surname',
            'email',
            'password',
            'image_id'
        ])

        const user = await User.create(data)

        return response
            .status(201)
            .send(await transform.item(user, UserTransformer))
    }

    /**
     * Display a single user.
     * GET users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, transform }) {
        const user = await User.findOrFail(params.id)
        return transform.item(user, UserTransformer)
    }

    /**
     * Update user details.
     * PUT or PATCH users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, transform }) {
        const user = await User.findOrFail(params.id)
        const data = request.only([
            'name',
            'surname',
            'email',
            'password',
            'image_id'
        ])

        user.merge(data)
        await user.save()
        return transform.item(user, UserTransformer)
    }

    /**
     * Delete a user with id.
     * DELETE users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, response }) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.message({ message: 'Usuário deletado com sucesso!' })
    }
}

module.exports = UserController
