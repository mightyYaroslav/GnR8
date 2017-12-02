const express = require('express')
const router = express.Router()

router.use('/albums', require('./albums'))
router.use('/user', require('./user'))
router.use('/profiles', require('./profiles'))
router.use('/api', require('./api'))
router.use('/docs', require('./docs'))

module.exports = router