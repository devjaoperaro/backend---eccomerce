'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cart extends Model {
    user() {
        return this.belongsTo('App/Models/User')
    }

    items() {
        return this.hasMany('App/Models/CartItem')
    }

    static get createdAtColumn() {
        return null
    }

    static get updatedAtColumn() {
        return null
    }
}

module.exports = Cart
