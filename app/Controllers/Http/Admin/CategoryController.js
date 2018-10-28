'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')
const Image = use('App/Models/Image')
const { manage_single_upload } = use('App/Helpers')
const Database = use('Database')
const Transformer = use('App/Transformers/Category/CategoriesTransformer')
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
     * @param { transform } ctx.transform
     */
    async index({ response, transform, pagination }) {
        const categories = await Category.query().paginate(
            pagination.page,
            pagination.perpage
        )
        return response.send(await transform.paginate(categories, Transformer))
    }

    /**
     * Create/save a new category.
     * POST categories
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response, transform }) {
        const transaction = await Database.beginTransaction()
        try {
            const { title, description } = request.all()

            const category = new Category()
            category.title = title
            category.description = description

            // Tratamento da imagem
            const image = request.file('image', {
                types: ['image'],
                size: '2mb'
            })

            let file = {}
            if (image) {
                file = await manage_single_upload(image)
                if (file.moved()) {
                    const category_image = await Image.create(
                        {
                            path: file.fileName,
                            size: file.size,
                            original_name: file.clientName,
                            extension: file.subtype
                        },
                        transaction
                    )
                    category.image_id = category_image.id
                }
            }

            await category.save(transaction)
            await transaction.commit()

            return response
                .status(201)
                .send(await transform.item(category, Transformer))
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
    async show({ params, response, transform }) {
        const category = await Category.findOrFail(params.id)
        return response.send(await transform.item(category, Transformer))
    }

    /**
     * Update category details.
     * PUT or PATCH categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response, transform }) {
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
                let file = await manage_single_upload(image)
                if (file.moved()) {
                    const category_image = await Image.create(
                        {
                            path: file.fileName,
                            size: file.size,
                            original_name: file.clientName,
                            extension: file.subtype
                        },
                        transaction
                    )
                    category.image_id = category_image.id
                }
            }

            await category.save(transaction)
            await transaction.commit()
            return response.send(await transform.item(category, Transformer))
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
    async destroy({ params, response }) {
        const category = await Category.find(params.id)
        category.delete()
        return response.send({
            status: 'sucesso',
            message: 'Categoria deletada com sucesso'
        })
    }
}

module.exports = CategoryController
