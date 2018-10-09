'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Coupon extends Model {
    users() {
        return this.belongsToMany('App/Models/User')
    }

    products() {
        return this.belongsToMany('App/Models/Product')
    }
}

module.exports = Coupon
