'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CouponProductSchema extends Schema {
    up() {
        this.create('coupon_product', table => {
            table.increments()
            table.integer('product_id').unsigned()
            table.integer('coupon_id').unsigned()

            table
                .foreign('product_id')
                .references('id')
                .inTable('products')
                .onDelte('cascade')

            table
                .foreign('coupon_id')
                .references('id')
                .inTable('coupons')
                .onDelte('cascade')
        })
    }

    down() {
        this.drop('coupon_products')
    }
}

module.exports = CouponProductSchema
