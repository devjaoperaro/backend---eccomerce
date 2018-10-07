'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

// Client Blueprint
Factory.blueprint('App/Models/User', faker => {
    return {
        name: faker.first(),
        surname: faker.last(),
        email: faker.email({ domain: 'fsocietybrasil.org' }),
        password: 'secret'
    }
})

// Cetegories blueprint
Factory.blueprint('App/Models/Category', faker => {
    return {
        title: faker.word(),
        description: faker.sentence()
    }
})

Factory.blueprint('App/Models/Product', faker => {
    return {
        name: faker.animal({ type: 'pet' }),
        description: faker.sentence(),
        price: faker.floating({ min: 0, max: 200, fixed: 2 })
    }
})
