if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}
const express = require('express')
const bodyParser = require('body-parser')
const busboyBodyParser = require('busboy-body-parser')

const cors = require('cors')
const passport = require('passport')
require('./config/passport')
const expressValidator = require('express-validator')

const app = express()
const port = process.env.PORT

global.__basedir = __dirname

if(process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan')
    app.use(morgan('dev'))
}

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())
app.use(expressValidator())
app.use(busboyBodyParser({limit: '5mb'}))

app.use(passport.initialize())

app.use(require('./routes'))

app.listen(port)
