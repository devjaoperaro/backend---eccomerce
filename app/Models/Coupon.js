'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Order = use('App/Models/Order')

class Coupon extends Model {
  static get dates() {
    return ['created_at', 'updated_at', 'valid_from', 'valid_until']
  }

  users() {
    return this.belongsToMany('App/Models/User')
  }

  products() {
    return this.belongsToMany('App/Models/Product')
  }

  orders() {
    return this.belongsToMany('App/Models/Order')
  }

  async calculateDiscount(order_id) {
    const order = await this.model
      .orders()
      .where('id', order_id)
      .first()
  }
}

module.exports = Coupon
