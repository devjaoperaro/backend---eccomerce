'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')
const Image = use('App/Models/Image')
const Helpers = use('Helpers')
const { manage_upload } = use('App/Helpers')
const Database = use('Database')
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
        const transaction = await Database.beginTransaction()
        try {
            const { title, description } = request.all()

            // Tratamento da imagem
            const image = request.file('image', {
                types: ['image'],
                size: '2mb'
            })

            let filename = await manage_upload(image)

            const category_image = await Image.create(
                {
                    path: filename,
                    size: image.size,
                    original_name: image.clientName,
                    extension: image.subtype
                },
                transaction
            )

            const category = await Category.create(
                {
                    title,
                    description,
                    image_id: category_image.id
                },
                transaction
            )
            await transaction.commit()

            return response.status(201).send(category)
        } catch (e) {
            await transaction.rollback()
            return response.status(400).send({
                message: 'Erro ao processar sua requisição',
                error: e.message
            })
        }
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
    async show({ params, request, response, view }) {
        const category = await Category.findOrFail(params.id)
        return response.send(category)
    }

    /**
     * Update category details.
     * PUT or PATCH categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        const transaction = await Database.beginTransaction()
        try {
            const category = await Category.findOrFail(params.id)
            category.merge(request.all())

            // Tratamento da imagem
            const image = request.file('image', {
                types: ['image'],
                size: '2mb'
            })

            if (image) {
                let filename = await manage_upload(image)

                const category_image = await Image.create(
                    {
                        path: filename,
                        size: image.size,
                        original_name: image.clientName,
                        extension: image.subtype
                    },
                    transaction
                )

                category.image_id = category_image.id
            }

            await category.save(transaction)
            await transaction.commit()
            return response.send(category)
        } catch (e) {
            await transaction.rollback()
            return response.status(400).send({
                message: 'Erro ao processar sua requisição!',
                error: e.message
            })
        }
    }

    /**
     * Delete a category with id.
     * DELETE categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        const category = await Category.find(params.id)
        category.delete()
        return response.send({
            status: 'sucesso',
            message: 'Categoria deletada com sucesso'
        })
    }
}

module.exports = CategoryController
