'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')
const ImageTransformer = use('App/Transformers/Product/ProductImageTransformer')

/**
 * ProductTransformer class
 *
 * @class ProductTransformer
 * @constructor
 */
class ProductTransformer extends TransformerAbstract {
    defaultInclude() {
        return ['images']
    }
    /**
     * This method is used to transform the data.
     */
    transform(product) {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price
        }
    }

    includeImages(product) {
        return this.collection(product.getRelated('images'), ImageTransformer)
    }
}

module.exports = ProductTransformer
