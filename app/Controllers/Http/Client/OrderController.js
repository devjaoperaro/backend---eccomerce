'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Order = use('App/Models/Order')
const Transformer = use('App/Transformers/Order/OrderTransformer')
const Database = use('Database')
const Service = use('App/Services/Orders/OrderService')
const Ws = use('Ws')

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, transform, pagination }) {
    const { number } = request.only(['number'])
    const query = Order.query()
    if (number) {
      query.where('id', 'LIKE', `${number}`)
    }
    const results = await query
      .orderBy('id', 'DESC')
      .paginate(pagination.page, pagination.perpage)
    const orders = await transform.paginate(results, Transformer)
    return response.send(orders)
  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth, transform }) {
    const trx = await Database.beginTransaction()
    try {
      const { items } = request.only(['items'])
      const client = await auth.getUser()
      var order = await Order.create({ user_id: client.id }, trx)
      const service = new Service(order, trx)
      if (items.length > 0) {
        await service.syncItems(items)
      }
      await trx.commit()
      order = await Order.find(order.id)
      order = await transform.include('items').item(order, Transformer)
      // Dispara o broadcast de novo pedido
      const topic = Ws.getChannel('notifications').topic('notifications')
      if (topic) {
        topic.broadcast('new:order', order)
      }
      return response.status(201).send(order)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível criar seu pedido no momento!'
      })
    }
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = OrderController
