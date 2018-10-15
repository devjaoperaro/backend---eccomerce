'use strict'

const crypto = use('crypto')
const Helpers = use('Helpers')
// const fs = use('fs')

/**
 * Generate random aplhanumeric string
 *
 * @param { int } length -  The length of the string
 * @return { string }       The Result
 */
const str_random = async (length = 40) => {
    let string = ''
    let len = string.length

    if (len < length) {
        let size = length - len
        let bytes = await crypto.randomBytes(size)
        let buffer = new Buffer(bytes)

        string += buffer
            .toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substr(0, size)
    }
    return string
}

const manage_upload = async file => {
    // gera um nome aleatório
    const random_name = await str_random(30)
    let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`

    // renomeia o arquivo e move para a pasta public/uploads
    await file.move(Helpers.publicPath('uploads'), {
        name: filename
    })

    // verifica se foi movido e retorna o erro
    if (!file.moved()) {
        throw file.error()
    }

    return filename
}

const manage_multiple_uploads = async fileJar => {
    let successes = []
    let errors = []

    await Promise.all(
        fileJar.files.map(async file => {
            let random_name = await str_random(30)
            let filename = `${new Date().getTime()}-${random_name}.${
                file.subtype
            }`
            await file.move(Helpers.publicPath('uploads'), {
                name: filename
            })

            if (file.moved()) {
                successes.push(file)
            } else {
                errors.push(file.error())
            }
        })
    )
    return { successes, errors }
}

module.exports = {
    str_random,
    manage_upload,
    manage_multiple_uploads
}
