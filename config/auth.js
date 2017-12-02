const db = require('../models/db')
const {sha512} = require('../helpers/util')
const serverSalt = process.env.SERVER_SALT

module.exports = function asyncAuthorizer(username, password, cb) {
    const passwordHash = sha512(password, serverSalt).passwordHash
    db.users.getForCredentials(username, passwordHash)
        .then(users => {
            const user = users[0]
            if (!user)
                return cb('No user')
            else
                return cb(null, user)
        })
        .catch(err => cb(err))
}