'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CartItem extends Model {
    product() {
        return this.belongsTo('App/Models/Product')
    }

    cart() {
        return this.belongsTo('App/Models/Cart')
    }

    static get createdAtColumn() {
        return null
    }

    static get updatedAtColumn() {
        return null
    }
}

module.exports = CartItem
