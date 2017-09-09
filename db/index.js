const conn = require('./conn')
const getSha1 = require('./getSha1')
const Message = require('./Message')
const User = require('./User')

Message.newMessage = (data)=> {
  let user
  return User.findById(data.user.id)
  .then(_user=> {
    user = _user
    return Message.create({ content: data.message })
  })
  .then(newMessage=> {
    return newMessage.setUser(user)
  })
}

function sync() {
  return conn.sync()
}

User.hasMany(Message)
Message.belongsTo(User)

module.exports = {
  conn,
  sync,
  getSha1,
  models: {
    User,
    Message
  }
}
