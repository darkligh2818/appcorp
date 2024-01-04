const { Schema, model } = require('mongoose')

const worker = new Schema({
  first_name: {
    type: String,
    required: [true, 'Xodim ismini kiriting']
  },
  last_name: {
    type: String,
    required: [true, 'Xodim familiyasini kiriting']
  },
  second_name: {
    type: String,
  },
  birthday: Date,
  photo: String,

  department: {
    type: Schema.Types.ObjectId,
    ref: 'department',
    required: [true, 'Xodim ishlayotgan bolimni tanlang']
  },
  rank: {
    type: Schema.Types.ObjectId,
    ref: 'rank',
    required: [true, 'Xodim lavozimi belgilanmagan']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Xodim uchun tizimdan foydalanish holati sozlanmagan']
  },
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('worker', worker)