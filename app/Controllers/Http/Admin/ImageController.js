'use strict'

const { manage_multiple_uploads } = use('App/Helpers')
const Image = use('App/Models/Image')

class ImageController {
    async bulkUpload({ request, response }) {
        const fileJar = request.file('files', {
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

        return response
            .status(201)
            .send({ successes: images, errors: files.errors })
    }
}

module.exports = ImageController
