const { Schema, model } = require('mongoose')


const skill_matrix = new Schema({
  title: { // mantiqiy fikrlash
    type: String,
    required: [true, 'Baho kriteriya nomini kiriting']
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'department'
  },
  text: String, // nomzondni ish jarayonida mantiqiy fikrlash olish qobiliyati
  questions: [String],
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('skill_matrix', skill_matrix)