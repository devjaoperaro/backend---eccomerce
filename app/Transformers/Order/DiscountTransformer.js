'use strict'

const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

/**
 * DiscountTransformer class
 *
 * @class DiscountTransformer
 * @constructor
 */
class DiscountTransformer extends TransformerAbstract {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      amount: model.discount
    }
  }
}

module.exports = DiscountTransformer
