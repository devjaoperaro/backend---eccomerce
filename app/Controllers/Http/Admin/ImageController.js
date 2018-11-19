'use strict'

const { manage_multiple_uploads } = use('App/Helpers')
const Image = use('App/Models/Image')
const fs = use('fs') // require('fs')
const Helpers = use('Helpers')
const Transformer = use('App/Transformers/Image/ImageTransformer')

class ImageController {
    async bulkUpload({ request, response, transform }) {
        const fileJar = request.file('images', {
            types: ['image'],
            size: '2mb'
        })

        let files = await manage_multiple_uploads(fileJar)
        let images = []
        await Promise.all(
            files.successes.map(async file => {
                let image = await Image.create({
                    path: file.fileName,
                    size: file.size,
                    original_name: file.clientName,
                    extension: file.subtype
                })
                images.push(image)
            })
        )

        images = await transform.collection(images, Transformer)

        return response
            .status(201)
            .send({ successes: images, errors: files.errors })
    }

    async index({ request, response, pagination }) {
        let images = await Image.query().paginate(
            pagination.page,
            pagination.perpage
        )
        return response.send(images)
    }

    async store({ request, response, transform }) {
        try {
            // Tratamento da imagem
            const image = request.file('image', {
                types: ['image'],
                size: '2mb'
            })

            let file = {}
            if (image) {
                file = await manage_single_upload(image)
                if (file.moved()) {
                    const imagem = await Image.create({
                        path: file.fileName,
                        size: file.size,
                        original_name: file.clientName,
                        extension: file.subtype
                    })

                    return response
                        .status(201)
                        .send(await transform.item(imagem, Transformer))
                }
            }
            return response
                .status(400)
                .send({ message: 'Não foi possível processar esta imagem' })
        } catch (e) {
            return response.status(500).send({
                message: 'Não foi possível processar a sua soliticação',
                error: e.message
            })
        }
    }

    async show({ request, response, params, transform }) {
        const image = await Image.findOrFail(params.id)
        return response.send(await transform.item(image, Transformer))
    }

    async destroy({ request, response, params }) {
        const image = await Image.findOrFail(params.id)

        try {
            let filePath = Helpers.publicPath(`uploads/${image.path}`)

            await fs.unlink(filePath, err => {
                if (err) throw err
            })

            await image.delete()
            return response
                .status(410)
                .send({ message: 'Imagem deletada com sucesso!' })
        } catch (e) {
            return response.status(400).send({
                message: 'Não foi possível processar a sua soliticação',
                error: e.message
            })
        }
    }
}

module.exports = ImageController
