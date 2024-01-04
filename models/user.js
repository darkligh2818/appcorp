const { Schema, model } = require('mongoose')

const user = new Schema({
  email: {
    type: String,
    required: [true, "Foydalanuvchi emaili bolishi shart"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Foydalanuvchi maxfiy kalitini kiriting"]
  },
  tempassword: String,
  tempexp: Date,
  role: {
    type: String,
    default: 'admin'
  },
  status: {
    type: Number,
    default: 0,
  }
}, { timestamps: true })


/* 
  status list: 
    0 -> vaqtincha foydalanuvchi
    1 -> activ foydalanuvchi 
    2 -> nofaol bolgan foydalanuvchi 
    3 -> arxivga tushgan foydalanuvchi
*/

module.exports = model('User', user)