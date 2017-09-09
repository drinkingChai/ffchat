const router = require('express').Router()
const conn = require('../db')
const User = conn.models.User

router.post('/new', (req, res, next)=> {
  User.create(req.body)
  .then(user=> {
    res.send(user.hash)
  })
})

router.get('/validate/:hash', (req, res, next)=> {
  User.getByHash(req.params.hash)
  .then(user=> {
    res.send(user)
  })
})

router.get('/login/:username/:password', (req, res, next)=> {
  User.getByUsernamePassword(req.params.username, req.params.password)
  .then(user=> {
    res.send(user)
  })
})

module.exports = router
