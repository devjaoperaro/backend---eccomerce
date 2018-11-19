'use strict'

const Coupon = use('App/Models/Coupon')
const Transformer = use('App/Transformers/Coupon/CouponTransformer')
const Database = use('Database')
const Service = use('App/Services/Coupon/CouponService')
/**
 * Resourceful controller for interacting with coupons
 */
class CouponController {
    /**
     * Show a list of all coupons.
     * GET coupons
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, transform, pagination }) {
        const coupons = await Coupon.query().paginate(
            pagination.page,
            pagination.perpage
        )
        return transform.paginate(coupons, Transformer)
    }

    /**
     * Create/save a new coupon.
     * POST coupons
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response, transform }) {
        const transaction = await Database.beginTransaction()
        try {
            const data = request.only([
                'code',
                'discount',
                'valid_from',
                'valid_until',
                'quantity',
                'type',
                'recursive'
            ])

            const { users, products, orders } = request.only([
                'users',
                'products',
                'orders'
            ])

            const coupon = await Coupon.create(data)
            const service = new Service(coupon, transaction)
            // insere os relacionamentos no DB
            users ? await service.syncUsers(users) : false
            products ? await service.syncProducts(products) : false
            orders ? await service.syncOrders(orders) : false

            await transaction.commit()

            return response
                .status(201)
                .send(
                    await transform
                        .include('users,products,orders')
                        .item(coupon, Transformer)
                )
        } catch (error) {
            await transaction.rollback()
            return response.status(400).send({ message: error.message })
        }
    }

    /**
     * Display a single coupon.
     * GET coupons/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, transform }) {
        const coupon = await Coupon.findOrFail(params.id)
        return transform
            .include('products,users,orders')
            .item(coupon, Transformer)
    }

    /**
     * Update coupon details.
     * PUT or PATCH coupons/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response, transform }) {
        const transaction = await Database.beginTransaction()
        let coupon = await Coupon.findOrFail(params.id)
        try {
            const data = request.only([
                'code',
                'discount',
                'valid_from',
                'valid_until',
                'quantity',
                'type',
                'recursive'
            ])

            coupon.merge(data)

            await coupon.save(transaction)

            const { users, products, orders } = request.only([
                'users',
                'products',
                'orders'
            ])

            const service = new Service(coupon, transaction)
            users ? await service.syncUsers(users) : false
            products ? await service.syncProducts(products) : false
            orders ? await service.syncOrders(orders) : false

            await transaction.commit()

            return response.send(
                await transform
                    .include('products,orders,users')
                    .item(coupon, Transformer)
            )
        } catch (error) {
            await transaction.rollback()
            return response.status(400).send({ message: error.message })
        }
    }

    /**
     * Delete a coupon with id.
     * DELETE coupons/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        const transaction = await Database.beginTransaction()
        const coupon = Coupon.findOrFail(params.id)
        try {
            await coupon.products().detach(null, transaction)
            await coupon.orders().detach(null, transaction)
            await coupon.users().detach(null, transaction)
            await coupon.delete(transaction)
            await transaction.commit()
            return response.send({ message: 'Cupom deletado com sucesso!' })
        } catch (error) {
            await transaction.rollback()
            return response.status(error.status).send(error)
        }
    }
}

module.exports = CouponController
