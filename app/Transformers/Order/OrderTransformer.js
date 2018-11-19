'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')
const UserTransformer = use('App/Transformers/User/UserTransformer')
const OrderItemTransformer = use('App/Transformers/Order/OrderItemTransformer')
const CouponTransformer = use('App/Transformers/Coupon/CouponTransformer')

/**
 * OrderTransformer class
 *
 * @class OrderTransformer
 * @constructor
 */
class OrderTransformer extends TransformerAbstract {
    availableInclude() {
        return ['user', 'coupons', 'items']
    }
    /**
     * This method is used to transform the data.
     */
    transform(order) {
        return {
            id: order.id,
            subtotal: order.subtotal,
            status: order.status
        }
    }

    includeUser(order) {
        return this.item(order.getRelated('user'), UserTransformer)
    }

    includeItems(order) {
        return this.collection(order.getRelated('items'), OrderItemTransformer)
    }

    includeCoupons(order) {
        return this.collection(order.getRelated('coupons'), CouponTransformer)
    }
}

module.exports = OrderTransformer
