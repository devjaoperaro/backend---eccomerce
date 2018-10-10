'use strict'

/*
|--------------------------------------------------------------------------
| CartSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Database = use('Database')

class CartSeeder {
    async run() {
        const clients = await User.query()
            .whereHas('roles', builder => builder.where('slug', 'client'))
            .fetch()

        const productIds = await Database.from('products').pluck('id')

        await Promise.all(
            clients.rows.map(async client => {
                // Cria o carrinho em memória
                const cart = await Factory.model('App/Models/Cart').make()
                // salva o carrinho, anexando ele ao client
                await client.carts().save(cart)
            })
        )
    }
}

module.exports = CartSeeder
