const express = require('express')
const router = express.Router()
const db = require('../../../../models/db')

const { check, validationResult } = require('express-validator/check')
const { matchedData } =  require('express-validator/filter')

/**
 * @api {post} /albums/add Add new album
 * @apiName AddAlbum
 * @apiGroup Albums
 * @apiPermission admin
 *
 * @apiParam {String} title Albums title
 * @apiParam {String} description Albums description
 * @apiParam {String} rating Albums rating (format: /\d\.\d/)
 * @apiParam {String} release_date Albums release date (format: /\d{4}-\d{2}-\d{2}/)
 * @apiParam {File} cover Albums cover (image)
 *
 * @apiSuccess {json} _ Empty object
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {}
 *
 * @apiError NotAuthorized You are not authorized
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *    "error": "You're not authorized"
 * }
 * @apiError Forbidden You must have admin rights to view this page
 * @apiErrorExample Forbidden
 * HTTP/1.1 403 Forbidden
 * {
 *    "error": "You're not allowed to view this page"
 * }
 * @apiError InvalidInput your input is not valid
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *    "error": ""
 * }
 *
 */
router.post('/', [
        check('title', 'Invalid title')
            .exists(),
        check('description', 'Invalid description')
            .exists(),
        check('rating', 'Invalid rating')
            .exists()
            .matches(/\d\.\d/),
        check('release_date', 'Invalid date')
            .exists()
            .matches(/\d{4}-\d{2}-\d{2}/)
    ], (req, res) => {
        let errors = validationResult(req)
        const fileIsOk = req.files.cover && /.*(\.png)|(\.jpe?g)|(\.gif)/.test(req.files.cover.name)
        if (!errors.isEmpty() || !fileIsOk) {
            if (fileIsOk)
                errors = errors.array()
            else
                errors = errors.array().concat([{ msg: "Image is invalid" }])
            res.status(500).send({ error: errors })
        } else {
            const album = matchedData(req)
            db.albums.add({ ...album, image: req.files.cover.data })
                .then(() => res.status(200).send({}))
                .catch(error => {
                    res.status(500).send({ error })
                })
        }
    })

module.exports = router