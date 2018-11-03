'use strict'

const OrderHook = (exports = module.exports = {})
const Database = use('Database')

OrderHook.updateValues = async modelInstance => {
    modelInstance.subtotal = await Database.from('order_items')
        .where('order_id', modelInstance.id)
        .getSum('subtotal')
    modelInstance.qty_items = await Database.from('order_items')
        .where('order_id', modelInstance.id)
        .getSum('quantity')
}
