const express = require('express')
const router = express.Router()
const passport = require('passport')

router.post('/', (req, res, next) => {
    passport.authenticate('local-login', (error, token, user) => {
        if(error)
            return res.status(401).json({ error })
        if(!user)
            return res.status(401).json({ error: "No such user"})
        return res.json({ user, token })
    })(req, res, next)
})

module.exports = router