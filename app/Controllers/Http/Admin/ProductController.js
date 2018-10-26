'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Product = use('App/Models/Product')
const Transformer = use('App/Transformers/Product/ProductTransformer')
const Database = use('Database')
/**
 * Resourceful controller for interacting with products
 */
class ProductController {
    /**
     * Show a list of all products.
     * GET products
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view, transform }) {
        const products = await Product.query().paginate()
        return response.send(await transform.paginate(products, Transformer))
    }

    /**
     * Create/save a new product.
     * POST products
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response, transform }) {
        const transaction = await Database.beginTransaction()
        try {
            let product = request.only(['name', 'description', 'price'])
            const { images } = request.only(['images'])
            product = await Product.create(product, transaction)
            await product.images().attach(images, null, transaction)
            await transaction.commit()
            return response
                .status(201)
                .send(await transform.item(product, Transformer))
        } catch (error) {
            await transaction.rollback()
            return response.status(error.status).send(error)
        }
    }

    /**
     * Display a single product.
     * GET products/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Update product details.
     * PUT or PATCH products/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a product with id.
     * DELETE products/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = ProductController
