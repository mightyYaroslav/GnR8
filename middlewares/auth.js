const jwt = require('jsonwebtoken')
const db = require('../models/db')

module.exports = {
    checkAuth: function(req, res, next) {
        if (!req.headers.authorization)
            return res.sendStatus(401)

        const token = req.headers.authorization.split(' ')[1];
        return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err)
                return res.sendStatus(401)
            const userId = decoded.sub
            db.users.getById(userId)
                .then((users) => {
                    req.user = users[0]
                    next()
                })
                .catch(error => res.status(401).send({error}))
        })
    },
    checkAdmin: function(req, res, next) {
        if (!req.headers.authorization)
            return res.sendStatus(401)

        const token = req.headers.authorization.split(' ')[1];
        return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err)
                return res.sendStatus(401)
            const userId = decoded.sub
            db.users.getAdminById(userId)
                .then((user) => {
                    req.user = user
                    next()
                })
                .catch(error => res.status(403).send({ error }))
        })
    }
}