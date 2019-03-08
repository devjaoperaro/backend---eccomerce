'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  /**
   * Products
   */
  Route.resource('products', 'ProductController').apiOnly()
})
  .namespace('Client')
  .prefix('v1')
