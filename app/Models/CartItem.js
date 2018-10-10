'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CartItem extends Model {
    static get createdAtColumn() {
        return null
    }

    static get updatedAtColumn() {
        return null
    }

    cart() {
        return this.belongsTo('App/Models/Cart')
    }
}

module.exports = CartItem
