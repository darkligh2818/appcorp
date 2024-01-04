const { Schema, model } = require('mongoose')


const expense_types = new Schema({
  title: {
    type: String,
    required: [true, 'Chiqim turlari nomi kiritilsin']
  },
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('expense_types', expense_types)