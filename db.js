const getSha1 = require('./getSha1')
const Sequelize = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL, { logging: false })

const Message = db.define('message', {
  content: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  }
})

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true },
    set(val) {
      this.setDataValue('password', getSha1(val))
    }
  }
}, {
  getterMethods: {
    hash() {
      return getSha1(`${this.name}${this.password}`)
    }
  }
})

User.getByHash = (hash)=> {
  return User.findAll()
  .then(users=> {
    let user = users.filter(user=> hash == user.hash)[0]
    if (user) return { name: user.name, id: user.id, hash: user.hash } // massage
  })
}

User.getByUsernamePassword = (username, password)=> {
  return User.findAll()
  .then(users=> {
    let user = users.filter(user=> getSha1(`${username}${getSha1(password)}`) == user.hash)[0]
    if (user) return { name: user.name, id: user.id, hash: user.hash } // massage
  })
}

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

User.hasMany(Message)
Message.belongsTo(User)


module.exports = {
  db,
  models: {
    User,
    Message
  }
}
