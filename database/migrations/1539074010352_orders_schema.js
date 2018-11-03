'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersSchema extends Schema {
    up() {
        this.create('orders', table => {
            table.increments()
            table.decimal('total', 12, 2)

            table
                .enu('status', ['pending', 'cancelled', 'shipped', 'paid'])
                .defaultTo('pending')

            table.timestamps()
        })
    }

    down() {
        this.drop('orders')
    }
}

module.exports = OrdersSchema
