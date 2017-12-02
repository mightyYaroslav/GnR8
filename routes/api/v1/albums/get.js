const express = require('express')
const router = express.Router()
const {chunk} = require('lodash')
const db = require('../../../../models/db')

const chunkLength = 3

/**
 * @api {get} /albums Request all albums info
 * @apiSampleRequest https://weblab7.herokuapp.com/api/v1/albums
 * @apiName GetAlbums
 * @apiGroup Albums
 * @apiPermission user
 *
 * @apiParam {String} page Results page (default - 0)
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type (application/x-www-form-urlencoded, application/json, application/xml)
 *
 * @apiSuccess {json} albums Object with album array info
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "albums": [
 *       {
 *           "title": "Use Your Illusion, Vol.1",
 *           "description": "Use Your Illusion I is the third studio album by American rock band Guns N' Roses. It was released on September 17, 1991, the same day as its counterpart album Use Your Illusion II. Both albums were released in conjunction with the Use Your Illusion Tour. The album debuted at No. 2 on the Billboard charts, selling 685,000 copies in its first week, behind Use Your Illusion II's first week sales of 770,000. Use Your Illusion I has sold 5,502,000 units in the U.S. as of 2010, according to Nielsen SoundScan. Each of the Use Your Illusion albums have been certified 7\ufffd\ufffd Platinum by the RIAA. It was nominated for a Grammy Award in 1992.",
 *           "rating": "5",
 *           "release_date": "1991-09-17",
 *           "id": "3",
 *           "image": {...}
 *        }
 *    ],
 *    "page": 0,
 *    "totalPages": 2
 * }
 * @apiError NotAuthorized You are not authorized
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *    "error": "You're not authorized"
 * }
 * @apiError NotFound There's no such page
 * @apiErrorExample NotFound
 * HTTP/1.1 404 NotFound
 * {
 *    "error": "There's no such page"
 * }
 * @apiError ServerError There is a problem connecting to db
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *    "error": ""
 * }
 */
router.get('/',
    (req, res) => {
        const page = req.query.page || 0
        db.albums.getAll()
            .then(albums => {
                const totalPages = albums.length / chunkLength
                if(page >= 0 && page < totalPages)
                    res.status(200).send({
                        albums: chunk(albums, chunkLength)[page],
                        page,
                        totalPages: Math.ceil(albums.length / chunkLength)
                    })
                else
                    res.status(404).send({ error: 'There\'s no such page' })
            })
            .catch(error => res.status(500).send({error}))
    })

/**
 * @api {get} /albums/:id Request album info by album id
 * @apiSampleRequest https://weblab7.herokuapp.com/api/v1/albums/3
 * @apiName GetAlbumById
 * @apiGroup Albums
 * @apiPermission user
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type (application/x-www-form-urlencoded, application/json, application/xml)
 *
 * @apiSuccess {json} album Object with album info
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "album": {
 *       {
 *           "title": "Use Your Illusion, Vol.1",
 *           "description": "Use Your Illusion I is the third studio album by American rock band Guns N' Roses. It was released on September 17, 1991, the same day as its counterpart album Use Your Illusion II. Both albums were released in conjunction with the Use Your Illusion Tour. The album debuted at No. 2 on the Billboard charts, selling 685,000 copies in its first week, behind Use Your Illusion II's first week sales of 770,000. Use Your Illusion I has sold 5,502,000 units in the U.S. as of 2010, according to Nielsen SoundScan. Each of the Use Your Illusion albums have been certified 7\ufffd\ufffd Platinum by the RIAA. It was nominated for a Grammy Award in 1992.",
 *           "rating": "5",
 *           "release_date": "1991-09-17",
 *           "id": "3",
 *           "image": {...}
 *        }
 *    }
 * }
 *
 * @apiError NotAuthorized You are not authorized
 * HTTP/1.1 401 Not authorized
 * {
 *    "error": "You're not authorized"
 * }
 * @apiError AlbumNotFound Album with such id is not found
 * HTTP/1.1 404 NotFound
 * {
 *    "error": ""
 * }
 *
 */
router.get('/:id(\\d+)',
    (req, res) => {
        db.albums.getById(req.params.id)
            .then(data => {
                res.status(200).send({
                    album: {
                        ...data[0],
                        release_year: data[0].release_date.substring(0, 4)
                    }
                })
            })
            .catch(error => res.status(404).send({error}))
    })


/**
 * @api {post} /albums/ Get album with similar title
 * @apiName SearchAlbum
 * @apiGroup Albums
 * @apiPermission user
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type (application/x-www-form-urlencoded, application/json, application/xml)
 *
 * @apiParam {String} searchTitle Albums title
 * @apiParam {String} page Results page (default - 0)
 *
 * @apiSuccess {json} albums Object with albums info
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "albums": {
 *       {
 *           "title": "Use Your Illusion, Vol.1",
 *           "description": "Use Your Illusion I is the third studio album by American rock band Guns N' Roses. It was released on September 17, 1991, the same day as its counterpart album Use Your Illusion II. Both albums were released in conjunction with the Use Your Illusion Tour. The album debuted at No. 2 on the Billboard charts, selling 685,000 copies in its first week, behind Use Your Illusion II's first week sales of 770,000. Use Your Illusion I has sold 5,502,000 units in the U.S. as of 2010, according to Nielsen SoundScan. Each of the Use Your Illusion albums have been certified 7\ufffd\ufffd Platinum by the RIAA. It was nominated for a Grammy Award in 1992.",
 *           "rating": "5",
 *           "release_date": "1991-09-17",
 *           "id": "3",
 *           "image": {...}
 *        }
 *    },
 *    "page": 0,
 *    "totalPages": 1,
 *    "searchText": "vol.1"
 * }
 *
 * @apiError NotAuthorized You are not authorized
 * HTTP/1.1 401 Not authorized
 * {
 *    "error": "You're not authorized"
 * }
 * @apiError NotFound There's no such page
 * HTTP/1.1 404 NotFound
 * {
 *    "error": "There's no such page"
 * }
 * @apiError ServerError There is a problem connecting to db
 * HTTP/1.1 500 ServerError
 * {
 *    "error": ""
 * }
 *
 */
router.post('/',
    (req, res) => {
        const page = req.body.page || 0
        db.albums.getByTitle(req.body.searchTitle)
            .then(albums => {
                const totalPages = albums.length / chunkLength
                if(page >= 0 && page < totalPages)
                    res.status(200).send({
                        albums: chunk(albums, chunkLength)[page],
                        page,
                        totalPages: Math.ceil(albums.length / chunkLength),
                        searchText: req.body.searchTitle
                    })
                else
                    res.status(404).send({ error: 'There\'s no such page' })
            })
            .catch(error => res.status(500).send({error}))
    })

module.exports = router