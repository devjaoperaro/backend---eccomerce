'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')
const Helpers = use('Helpers')
const { str_random } = use('App/Helpers')
/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
    /**
     * Show a list of all categories.
     * GET categories
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        const categories = await Category.query().paginate()
        return response.send(categories)
    }

    /**
     * Create/save a new category.
     * POST categories
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        const { title, description } = request.all()

        // Tratamento da imagem
        const image = request.file('image', {
            types: ['image'],
            size: '2mb'
        })

        // gera um nome aleatório
        const filename = await str_random(30)

        // renomeia o arquivo e move para a pasta public/uploads
        await image.move(Helpers.publicPath('uploads'), {
            name: `${new Date().getTime()}_${filename}.${image.subtype}`
        })

        if (!image.moved()) {
            return response.status(400).send({
                message: 'Erro ao processar sua requisição',
                error: image.error()
            })
        }
        const category = await Category.create({ title, description })
        return response.status(201).send(category)
    }

    /**
     * Display a single category.
     * GET categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing category.
     * GET categories/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update category details.
     * PUT or PATCH categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a category with id.
     * DELETE categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = CategoryController
