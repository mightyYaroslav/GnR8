const express = require('express')
const router = express.Router()
const db = require('../../models/db')
const { checkAdmin } = require('../../middlewares/auth')

router.post('/',
    checkAdmin,
    (req, res) => {
    db.albums.remove(req.body.id)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(400).send({ errors: [err] }))
})

module.exports = router