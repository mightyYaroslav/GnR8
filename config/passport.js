const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models/db')
const jwt = require('jsonwebtoken')
const {sha512} = require('../helpers/util')
const serverSalt = process.env.SERVER_SALT

passport.use('local-login', new LocalStrategy({
    session: false
},(username, password, done) => {
    const passwordHash = sha512(password, serverSalt).passwordHash
    console.log('Username: ', username, ' passwordhsh: ', passwordHash)
    db.users.getForCredentials(username, passwordHash)
        .then(users => {
            const user = users[0]
            console.log('Users: ', user)
            if (!user) {
                return done('No user')
            } else {
                const payload = { sub: user.id }
                const token = jwt.sign(payload, process.env.JWT_SECRET)
                return done(null, token, user)
            }
        })
        .catch(err => done(err))
}))

passport.use('local-signup', new LocalStrategy({
    session: false,
    passReqToCallback: true
}, (req, username, password, done) => {
    const passwordHash = sha512(password, serverSalt).passwordHash
    db.users.add({
        username,
        passwordHash,
        email: req.body.email,
        role: 'user'
    })
        .then(users => {
            console.log('Users: ', users)
            done(null, users[0])
        })
        .catch(error => done(error))
})
)