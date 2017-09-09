const conn = require('./conn')
const getSha1 = require('./getSha1')

const User = conn.define('user', {
  name: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true }
  },
  password: {
    type: conn.Sequelize.STRING,
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

module.exports = User
