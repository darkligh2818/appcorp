const { Schema, model } = require('mongoose')


const budget_planning = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project'
  },

  expense_type: {
    type: Schema.Types.ObjectId,
    ref: 'expense_types'
  },
  estimated_cost: {
    type: Number,
    required: [true, 'Chiqim summasi kiritilsin']
  },
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('budget_planning', budget_planning)