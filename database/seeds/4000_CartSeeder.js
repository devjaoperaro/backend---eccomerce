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

class CartSeeder {
    async run() {
        // const clients = await User.query()
        //     .whereHas('roles', builder => builder.where('slug', 'client'))
        //     .fetch()
        // await Promise.all(
        //     clients.rows.map(async client => {
        //         const cart = await Factory.model('App/Models/Cart').make()
        //         await client.carts().save(cart)
        //     })
        // )
        // await Factory.model('App/Models/CartItem').createMany(30)
    }
}

module.exports = CartSeeder
