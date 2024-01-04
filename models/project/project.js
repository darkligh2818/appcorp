const { Schema, model } = require('mongoose')


const project = new Schema({
  name: {
    type: String,
    required: [true, 'Mijos ism-familiyasi kiriting']
  },
  desc: String,
  startDate: String,
  endDate: String,
  client: {
    type: Schema.Types.ObjectId,
    ref: 'client'
  },
  pm: {
    type: Schema.Types.ObjectId,
    ref: 'worker' // project menejment
  },
  status: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = model('project', project)