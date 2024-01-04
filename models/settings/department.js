const { Schema, model } = require('mongoose')


const department = new Schema({
  title: {
    type: String,
    required: [true, 'Bolim nomini kiriting']
  },
  text: String,
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('department', department)