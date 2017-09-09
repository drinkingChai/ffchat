const router = require('express').Router()
const conn = require('../db')
const Message = conn.models.Message

router.get('/', (req, res, next)=> {
  Message.findAll({
    include: [ User ]
  })
  .then(messages=> res.send(messages))
})

router.post('/new', (req, res, next)=> {
  Message.newMessage(req.body)
  .then(newMessage=> res.send(newMessage))
})

module.exports = router
