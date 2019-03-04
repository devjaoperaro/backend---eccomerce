'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Discount extends Model {
  static boot() {
    super.boot()

    this.addHook('beforeSave', 'DiscountHook.calculateValues')
  }

  static get table() {
    return 'coupon_order'
  }

  order() {
    return this.belongsTo('App/Models/Order')
  }

  coupon() {
    return this.belongsTo('App/Models/Coupon')
  }
}

module.exports = Discount
