'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
    /**
     * Relacionamento entre o produto e as imagens
     */
    images() {
        return this.belongsToMany('App/Models/Image')
    }
}

module.exports = Product
