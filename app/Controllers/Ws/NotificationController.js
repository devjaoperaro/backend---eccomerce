'use strict'

class NotificationController {
  constructor({ socket, request, auth }) {
    this.socket = socket
    this.request = request
    this.loadUser(auth)
      .then(user => {
        socket.broadcast('new:connection', {
          message: 'Nova Conexão!',
          user
        })
      })
      .catch(e => {
        throw e
      })
  }

  async loadUser(auth) {
    const user = await auth.getUser()
    return user
  }

  onMessage(message) {
    console.log('Nova mensagem', message)
    this.socket.broadcastToAll('message', message)
  }
}

module.exports = NotificationController
