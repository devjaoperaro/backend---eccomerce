'use strict'

const User = use('App/Models/User')
const Order = use('App/Models/Order')
const Product = use('App/Models/Product')

class CouponService {
    constructor(model, trx) {
        this.model = model
        this.trx = trx
    }

    async syncUsers(users) {
        if (!Array.isArray(users)) {
            return false
        }

        for (let user of users) {
            user = await User.find(user)
            if (user instanceof User) {
                await this.model.users().sync([user.id], null, this.trx)
            }
        }
    }

    async syncOrders(orders) {
        if (!Array.isArray(orders)) {
            return false
        }

        for (let order of orders) {
            order = await Order.find(order)
            if (order instanceof Order) {
                await this.model.orders().sync([order.id], null, this.trx)
            }
        }
    }

    async syncProducts(products) {
        if (!Array.isArray(products)) {
            return false
        }

        for (let product of products) {
            product = await Product.find(product)
            if (product instanceof Product) {
                await this.model.products().sync([product.id], null, this.trx)
            }
        }
    }
}

module.exports = CouponService
