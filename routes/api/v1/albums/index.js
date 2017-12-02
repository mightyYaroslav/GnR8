const express = require('express')
const router = express.Router()

router.use('/', require('./get'))
router.use('/add', require('./add'))
router.use('/remove', require('./remove'))

module.exports = router