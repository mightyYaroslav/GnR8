const express = require('express')
const router = express.Router()
const db = require('../../../../models/db')

/**
 * @api {post} /albums/remove Remove album info
 * @apiSampleRequest https://weblab7.herokuapp.com/api/v1/albums/remove
 * @apiName RemoveAlbum
 * @apiGroup Albums
 * @apiPermission admin
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type (application/x-www-form-urlencoded, application/json, application/xml)
 *
 * @apiParam {Number} id The id of the album to be removed
 *
 * @apiSuccess {json} _ Empty Object
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
 * @apiError DbConnectionError Smth happened to our database
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *    "error": "DbConnectionError"
 * }
 */
router.post('/',
    (req, res) => {
        db.albums.remove(req.body.id)
            .then(() => res.status(200).send({}))
            .catch(error => res.status(500).send({ error }))
    })

module.exports = router