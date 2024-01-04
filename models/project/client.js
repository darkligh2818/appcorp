const { Schema, model } = require('mongoose')


const client = new Schema({
  name: {
    type: String,
    required: [true, 'Mijosni ism-familiyasi kiriting']
  },
  phone: String,
  email: String,
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('client', client)