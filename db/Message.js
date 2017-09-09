const conn = require('./conn')

const Message = conn.define('message', {
  content: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  }
})

module.exports = Message
