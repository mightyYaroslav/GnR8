const express = require('express')
const router = express.Router()
const asyncAuthorizer = require('../../../config/auth')
const basicAuth = require('express-basic-auth')
const { checkAdmin } = require('../../../middlewares/auth')

router.use(basicAuth({
    authorizer: asyncAuthorizer,
    authorizeAsync: true
}))

router.use('/albums', require('./albums'))
router.use('/users', checkAdmin, require('./users'))

module.exports = router