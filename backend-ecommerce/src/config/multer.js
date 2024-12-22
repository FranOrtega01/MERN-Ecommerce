import multer from 'multer'
import fs from 'fs'
import __dirname from '../utils.js'

export const DOCUMENT_TYPES = {
    PROFILE: 'profile',
    PRODUCT: 'product',
    DOCUMENT: 'document',
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        const  _id  = req.user.user._id
        const type = req.body.type_document
        console.log(type);
        if (type === DOCUMENT_TYPES.PROFILE) {
            cb(null, __dirname + '/public/userUpload/img/profiles')
        } else if (type === DOCUMENT_TYPES.PRODUCT) {
            cb(null, __dirname + '/public/userUpload/img/products')
        } else if (type === DOCUMENT_TYPES.DOCUMENT) {
            const dir = __dirname + `/public/userUpload/documents/${_id}`
            if (!fs.existsSync(dir)) {
                return fs.mkdir(dir, error => cb(error, dir))
            }
            cb(null, dir)
        } 
    },
    filename: function (req, file, cb) {
        const _id = req.user.user._id
        const type = req.body.type_document
        console.log(type);
        if (type === DOCUMENT_TYPES.PROFILE) {
            file.document_type = DOCUMENT_TYPES.PROFILE
            cb(null, `${_id}.png`)
        } else if (type === DOCUMENT_TYPES.PRODUCT) {
            file.document_type = DOCUMENT_TYPES.PRODUCT
            const { title } = req.body
            const prdTitle = title.split(' ').join('-')
            let fileName = `${prdTitle}`.toLowerCase()
            cb(null, `${fileName}.png`)
        } else if (type === DOCUMENT_TYPES.DOCUMENT) {
            file.document_type = file.fieldname
            cb(null, `${file.fieldname}.pdf`)
        }
    },
})

export const fileUploader = multer({ storage })