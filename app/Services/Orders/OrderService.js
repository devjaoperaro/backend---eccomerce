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

    async updateItems(items) {
        let currentItems = await this.model
            .items()
            .whereIn('id', items.map(item => item.id))
            .fetch()

        currentItems.rows.map(async item => {
            item.fills(items.filter(n => n.id === item.id)[0])
            await item.save(this.trx)
        })
    }
}

module.exports = OrderService
