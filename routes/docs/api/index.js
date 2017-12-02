const express = require('express')
const router = express.Router()

router.use('/v1', express.static(__basedir + '/docs/api/v1'))

module.exports = router