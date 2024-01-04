const { Schema, model } = require('mongoose')

const interview = new Schema({
  candidat: {
    type: Schema.Types.ObjectId,
    ref: 'candidat',
    required: [true, 'Nomzod belgilanmagan']
  },
  interviewer: {
    type: Schema.Types.ObjectId,
    ref: 'worker',
    required: [true, 'Nomzodni suhbatdan otqazgan xodimimiz belgilanmagan']
  },
  skill_matrixes: [
    {
      skill_matrix: {
        type: Schema.Types.ObjectId,
        ref: 'skil_matrix',
      },
      feedbacktext: String, // suhbatdagi kriteriya hisoboti
      feedbackmark: Number, // suhbatdagi kriteriya bahosi
    }
  ],
  interview_start: Date,
  interview_end: Date,

  finish_feedback_text: String,
  finish_mark: Number,

  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = model('interview', interview)