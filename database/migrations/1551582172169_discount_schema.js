'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DiscountSchema extends Schema {
  up() {
    this.create('discounts', table => {
      table.increments()
      table.integer('coupon_id').unsigned()
      table.integer('order_id').unsigned()
      table.decimal('amount', 12, 2).defaultTo(0.0)
      table.enu('status', ['pending', 'applied']).defaultTo('pending')

      table.timestamps()

      table
        .foreign('coupon_id')
        .references('id')
        .inTable('coupons')
        .onDelete('cascade')
      table
        .foreign('order_id')
        .references('id')
        .inTable('orders')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('discounts')
  }
}

module.exports = DiscountSchema
