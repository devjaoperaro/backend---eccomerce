'use stric'

class OrderService {
    constructor(modelInstance, trx) {
        this.model = modelInstance
        this.trx = trx
    }

    async syncItems(items) {
        await this.model.items().delete(this.trx)
        return await this.model.items().createMany(items, this.trx)
    }
}

module.exports = OrderService
