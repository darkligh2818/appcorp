const { Schema, model } = require('mongoose')


const rank = new Schema({
  title: {
    type: String,
    required: [true, 'Lavozim nomini kiriting']
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'department',
    required: [true, 'Lavozim biriktirilgan Bolim kiritilmagan']
  },
  text: String,
  createdAt: Date,
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('rank', rank)