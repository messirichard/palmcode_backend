const multer = require("multer")
const path = require("path")
const fs = require("fs")
const randomstring = require('uuidv4');
const Axios = require("axios");
const {s3} = require("../util/util");

const filename = (_, file, cb) => {
    cb(null, randomstring.uuid() + path.extname(file.originalname))
}

exports.generateFileUrl = key => process.env.S3_HOST + key

/**
 * delete s3 image
 * @param key {String}
 * @returns {Promise<void>}
 */
exports.deleteObject = async key => {
    await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: key
    }).promise()
}

/**
 * Upload S3 from Url
 *
 * @param url {String}
 * @param folder {String}
 * @return {Promise<string>}
 */
exports.uploadFromUrl = async (url, folder) => {
    const response = await Axios.get(url, {responseType: "arraybuffer", responseEncoding: "binary"})

    const Key = `${folder}/` + `${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}/` + randomstring.uuid() + path.extname(url.split("?")[0])
    await s3.putObject({
        ContentType: response.headers["content-type"],
        ContentLength: response.data.length.toString(), // or response.header["content-length"] if available for the type of file downloaded
        Bucket: process.env.AWS_BUCKET,
        Body: response.data,
        Key,
    }).promise()

    return Key
}


/**
 * Handle single field file upload using multer
 *
 * @param {string} dest
 * @param field
 */
exports.multerSingleFieldFileHandler = (dest, field = "image") =>
    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                req.dest = dest;
                req.field = field;
                try {
                    fs.mkdirSync(path.join(__dirname, `../uploads`), {recursive: true})
                    fs.mkdirSync(path.join(__dirname, `../uploads/${req.dest}`), {recursive: true})
                    cb(null, path.join(__dirname, `../uploads/${req.dest}`))
                } catch (e) {
                    console.error("error creating directory at file handler", e)
                    cb(e, null)
                }
            },
            filename,
        }),
        limits: {
            fileSize: 1024 * 1024 * 5,
        },
    }).fields([{name: field, maxCount: 1}])

/**
 * Handle multiple field file upload using multer
 *
 * @param {array} options
 */
exports.multerMultipleFieldHandler = options => multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = options
            for (const {name, dest} of options) {
                if (file.fieldname === name) {
                    try {
                        fs.mkdirSync(path.join(__dirname, `../uploads`), {recursive: true})
                        fs.mkdirSync(path.join(__dirname, `../uploads/${dest}`), {recursive: true})
                    } catch (e) {
                        console.log("error creating directory at file handler", e)
                    }
                    return cb(null, path.join(__dirname, `../uploads/${dest}`))
                }
            }
        },
        filename,
    }),
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
}).fields(options.map(({name, maxCount}) => ({name, maxCount})));
