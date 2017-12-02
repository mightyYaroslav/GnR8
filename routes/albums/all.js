const express = require('express')
const db = require('../../models/db')
const { checkAuth } = require('../../middlewares/auth')
const router = express.Router()

router.get('/',
    checkAuth,
    (req, res) => {
    db.albums.getAll()
        .then(data => res.json({
                albums: data,
                searchText: "",
            }))
        .catch(err => res.status(400).send({ errors: [err] }))
})

router.get('/:id(\\d+)',
    checkAuth,
    (req, res) => {
    db.albums.getById(req.params.id)
        .then(data => {
            res.json({...data[0], release_year: data[0].release_date.substring(0,4)})
        })
        .catch(err => res.status(400).send({ errors: [err] }))

})

router.post('/',
    checkAuth,
    (req, res) => {
    db.albums.getByTitle(req.body.searchTitle || '')
        .then(data => {
            res.json({
                albums: data,
                searchText: req.body.searchTitle
            })
        })
        .catch(err => res.status(400).send( {errors: [err]}))
})

module.exports = router