const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    req.logout()
    res.sendStatus(200)
})

module.exports = router