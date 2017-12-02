const express = require('express')
const router = express.Router()
const { chunk } = require('lodash')
const db = require('../../../../models/db')

const chunkLength = 3

/**
 * @api {get} /users/Request all users info
 * @apiSampleRequest https://weblab7.herokuapp.com/api/v1/users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type (application/x-www-form-urlencoded, application/json, application/xml)
 *
 * @apiParam {String} page Results page (default - 0)
 *
 * @apiSuccess {json} users Object with users array info
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 Success
 * {
 *   "users": [
 *     {
 *       "id": "1",
 *       "username": "useruser8",
 *       "password_hash": "8c9713c3482794b84246a3d5618b4b9d954a78934701b2f3adaf473cdafef7425e1755bd24f4f3e36a1395efdd137f6e81b554a0e20c3a1f5bb4b152623b671c",
 *       "role": "user"
 *     },
 *     {
 *       "id": "3",
 *       "username": "admin",
 *       "password_hash": "89bc1887e657da3de01f02d7c4475a4731e1d41e1fbcb4f47151e8e129285db073048b17532cd9aa4c8f56b94d3ce1e104f4c2a5b1139440af518461729eb430",
 *       "role": "admin"
 *     },
 *     {
 *       "id": "4",
 *       "username": "useruser7",
 *       "password_hash": "3c705e3bd31ac58ae537f3020d3b57e53d8d27d7e6776229d14e178899857f31bfca07db03f4bcdcb295f4d918dacf7f6fdab830ffe8d857cc28c01002fd2afc",
 *       "role": "user"
 *     }
 *   ],
 *   "page": "0",
 *   "totalPages": 2
 * }
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
 * @apiError NotFound There's no such page
 * @apiErrorExample NotFound
 * HTTP/1.1 404 NotFound
 * {
 *    "error": "There's no such page"
 * }
 * @apiError ServerError You have entered wrong data
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *    "error": ""
 * }
 */
router.get('/', (req, res) => {
    const page = req.query.page || 0
    db.users.getAll()
        .then(users => {
            const totalPages = users.length / chunkLength
            if(page >= 0 && page < totalPages)
                res.status(200).send({
                    users: chunk(users, chunkLength)[page],
                    page,
                    totalPages: Math.ceil(users.length / chunkLength)
                })
            else
                res.status(404).send({ error: 'There\'s no such page' })
        })
        .catch(error => res.status(500).send({ error }))
})

/**
 * @api {get} /users/:id Request user info by id
 * @apiSampleRequest https://weblab7.herokuapp.com/api/v1/users/1
 * @apiName GetUserById
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type (application/x-www-form-urlencoded, application/json, application/xml)
 *
 * @apiSuccess {json} users Object with user info
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "user": {
 *      "id": "1",
 *      "username": "useruser8",
 *      "password_hash": "8c9713c3482794b84246a3d5618b4b9d954a78934701b2f3adaf473cdafef7425e1755bd24f4f3e36a1395efdd137f6e81b554a0e20c3a1f5bb4b152623b671c",
 *      "role": "user"
*     }
 * }
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
 * @apiError ServerError You entered wrong data
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *    "error": ""
 * }
 */
router.get('/:id(\\d+)', (req, res) => {
    db.users.getById(req.params.id)
        .then(users => res.status(200).send({ user: users[0]}))
        .catch(error => res.status(500).send({ error }))
})

/**
 * @api {get} /users/:username Request users info by username
 * @apiSampleRequest https://weblab7.herokuapp.com/api/v1/users/user
 * @apiName GetUsersByUsername
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type (application/x-www-form-urlencoded, application/json, application/xml)
 *
 * @apiParam {String} page Results page (default - 0)
 *
 * @apiSuccess {json} users Object with users array info
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "users": [
 *     {
 *       "id": "1",
 *        "username": "useruser8",
 *        "password_hash": "8c9713c3482794b84246a3d5618b4b9d954a78934701b2f3adaf473cdafef7425e1755bd24f4f3e36a1395efdd137f6e81b554a0e20c3a1f5bb4b152623b671c",
 *        "role": "user"
 *      },
 *      {
 *        "id": "4",
 *        "username": "useruser7",
 *        "password_hash": "3c705e3bd31ac58ae537f3020d3b57e53d8d27d7e6776229d14e178899857f31bfca07db03f4bcdcb295f4d918dacf7f6fdab830ffe8d857cc28c01002fd2afc",
 *        "role": "user"
 *      },
 *      {
 *        "id": "6",
 *        "username": "useruser16",
 *        "password_hash": "7226fcfeb440aeccbcc20dbfea5f67f3ea48a42ed954c9215813785c6856bd87e634edc3deec23bb6fea8379190306365a21cfd344e39841b595ea5ce4e536b9",
 *        "role": "user"
 *      }
 *    ],
 *    "page": 0,
 *    "totalPages": 1
 *  }
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
 * @apiError NotFound There's no such page
 * @apiErrorExample NotFound
 * HTTP/1.1 404 NotFound
 * {
 *    "error": "There's no such page"
 * }
 * @apiError ServerError You have entered wrong data
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *    "error": ""
 * }
 */
router.get('/:username', (req, res) => {
    const page = req.query.page || 0
    db.users.getByUsername(req.params.username)
        .then(users => {
            const totalPages = users.length / chunkLength
            if(page >= 0 && page < totalPages)
                res.status(200).send({
                    users: chunk(users, chunkLength)[page],
                    page,
                    totalPages: Math.ceil(users.length / chunkLength)
                })
            else
                res.status(404).send({ error: 'There\'s no such page' })
        })
        .catch(error => res.status(500).send({ error }))
})

module.exports = router