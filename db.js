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
    return users.filter(user=> hash == user.hash)
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