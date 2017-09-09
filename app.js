const express = require('express')
const nunjucks = require('nunjucks')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const conn = require('./db')
const User = conn.models.User
const Message = conn.models.Message
const users = require('./routes/users');
const messages = require('./routes/messages');

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
  Message.findAll({ include: [ User ]})
  .then(messages=> {
    res.render('index', { messages })
  })
})

app.use('/users', users)
app.use('/messages', messages)



const port = process.env.PORT || 3000


conn.sync()
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
