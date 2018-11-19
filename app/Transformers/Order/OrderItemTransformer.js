'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')
const productTransformer = use('App/Transformers/Coupon/ProductsTransformer')

/**
 * OrderItemTransformer class
 *
 * @class OrderItemTransformer
 * @constructor
 */
class OrderItemTransformer extends TransformerAbstract {
    defaultInclude() {
        return ['product']
    }
    /**
     * This method is used to transform the data.
     */
    transform(item) {
        return {
            id: item.id,
            subtotal: item.subtotal,
            quantity: item.quantity
        }
    }

    includeProduct(orderItem) {
        return this.item(orderItem.getRelated('product'), productTransformer)
    }
}

module.exports = OrderItemTransformer
