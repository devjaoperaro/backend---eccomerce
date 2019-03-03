'use stric'
const Database = use('Database')
const { calcPercent } = use('App/Helpers')

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
        // Deleta os itens que não estão em `items`
        await this.model
            .items()
            .whereNotIn('id', items.map(item => item.id))
            .delete(this.trx)

        // Atualiza os valores e quantidades dos itens armazenados em `items`
        await Promise.all(
            currentItems.rows.map(async item => {
                item.fill(items.filter(n => n.id === item.id)[0])
                await item.save(this.trx)
            })
        )
    }

    applyToProducts(orderItems, availableProducts) {
        orderItems.map()
    }

    async applyDiscount(coupon) {
        // armazena o saldo do desconto

        /**
         * Calcula o desconto baseado nos produtos que estão no pedido
         */
        const couponProducts = await Database.from('coupon_product')
            .where('coupon_id', coupon.id)
            .pluck('product_id') // retorna um array com os IDs

        // verifica se este cupon tem algum produto associado
        if (Array.isArray(couponProducts) && couponProducts.length > 0) {
            const availableItems = await this.model
                .items()
                .whereHas('product', builder => {
                    builder.whereIn('id', couponProducts)
                })
                .fetch()

            // este pedido tem itens cujo cupom de desconto se aplica
            if (availableItems.rows && availableItems.rows.length > 0) {
                //
            }
        }
    }
}

module.exports = OrderService
