'use strict'

const Cart = use('App/Models/Cart')

const CartItemHook = (exports = module.exports = {})

CartItemHook.incrementCartTotal = async CartItem => {
    await CartItem.load('product')
    CartItem = CartItem.toJSON()

    let subtotal = CartItem.qty * CartItem.product.price
    let cart = await Cart.find(CartItem.cart_id)
    cart.total += subtotal
    await cart.save()
}

CartItemHook.decrementCartTotal = async CartItem => {
    await CartItem.load('product')
    let product = CartItem.toJSON().product

    let subtotal = CartItem.qty * product.price
    let cart = await Cart.find(CartItem.cart_id)
    cart.total -= subtotal
    await cart.save()
}
