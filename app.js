const express = require('express')
const nunjucks = require('nunjucks')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const getSha1 = require('./getSha1')
const conn = require('./db')

const app = express()
app.set('view engine', 'html')
app.engine('html', nunjucks.render)
nunjucks.configure('views', { noCache: true })

app.use(bodyParser.json())
app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist`))
app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res, next)=> {
  res.render('login')
})

app.get('/index', (req, res, next)=> {
  res.render('index')
})

app.post('/users/new', (req, res, next)=> {
  conn.models.User.create(req.body)
  .then(user=> {
    res.send(user.hash)
  })
})

app.get('/users/validate/:hash', (req, res, next)=> {
  conn.models.User.getByHash(req.params.hash)
  .then(users=> {
    res.send(users[0] ? users[0].name : null)
  })
})

app.get('/users/login/:name/:password', (req, res, next)=> {
  conn.models.User.getByHash(getSha1(`${req.params.name}${getSha1(req.params.password)}`))
  .then(users=> {
    res.send(users[0] ? { name: users[0].name, hash: users[0].hash } : null)
  })
})

const port = process.env.PORT || 3000


conn.db.sync({ force: true })
.then(()=> {
  const server = app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  })
  const io = socketio(server)

  io.on('connection', (socket)=> {
    console.log(`someone connected ${socket.id}`);

    socket.on('newMessage', (payload)=> {
      console.log(`received a new message`);
      io.sockets.emit('newMessage', payload);
    })

    socket.on('disconnect', (socket)=> {
      console.log(`someone left :'(`);
    })
  })
})