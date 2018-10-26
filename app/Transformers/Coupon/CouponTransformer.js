'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

/**
 * CouponTransformer class
 *
 * @class CouponTransformer
 * @constructor
 */
class CouponTransformer extends TransformerAbstract {
    /**
     * This method is used to transform the data.
     */
    transform(coupon) {
        coupon = coupon.toJSON()
        delete coupon.created_at
        delete coupon.updated_at
        return coupon
    }
}

module.exports = CouponTransformer
