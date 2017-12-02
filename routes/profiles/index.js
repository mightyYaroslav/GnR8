const express = require('express')
const router = express.Router()
const db = require('../../models/db')
const { checkAdmin } = require('../../middlewares/auth')

router.get('/',
    checkAdmin,
    (req, res) => {
    db.users.getAll()
        .then(users => res.json({ users }))
        .catch(err => res.status(400).send({ errors: [err] }))
})

module.exports = router