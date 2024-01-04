const { Schema, model } = require('mongoose')

const candidat = new Schema({
  first_name: {
    type: String,
    required: [true, 'Nomzod ismini kiriting']
  },
  last_name: {
    type: String,
    required: [true, 'Nomzod familiyasini kiriting']
  },
  second_name: {
    type: String,
  },
  photo: String,
  resume: String,
  Phone: String,
  rank: {
    type: Schema.Types.ObjectId,
    ref: 'rank',
    required: [true, 'Nomzod qaysi lavozimga topshirgan']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Nomzoga tizimga dostup ochilmagan']
  },
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('candidat', candidat) 