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

    /**
     * Relacionamento entre Produto e Categorias
     */
    categories() {
        return this.belongsToMany('App/Models/Category')
    }
}

module.exports = Product
