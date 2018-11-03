'use strict'

const OrderHook = (exports = module.exports = {})

OrderHook.updateValues = async modelInstance => {
    modelInstance.subtotal = await modelInstance.items().getSum('subtotal')
    modelInstance.qty_items = await modelInstance.items().getSum('quantity')
}
