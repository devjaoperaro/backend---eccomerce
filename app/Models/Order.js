'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
    static boot() {
        super.boot()

        this.addHook('afterFind', 'OrderHook.updateValues')
    }

    /**
     * Relacionamento entre o pedido e os itens do pedido
     */
    items() {
        return this.hasMany('App/Models/OrderItem')
    }

    coupons() {
        return this.belongsToMany('App/Models/Coupon')
    }
}

module.exports = Order
