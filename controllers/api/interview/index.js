const Interview = require('../../../models/interview/interview')
const { sendemail } = require('../../../utils/email')
const user = require('../../../models/user')

const add_interview = async (req, res) => {
  const { candidat, interviewer, skill_matrixes, interview_start, interview_end, finish_feedback_text } = req.body

  let finish_mark = 0

  skill_matrixes.forEach((item) => {
    finish_mark += item.feedbackmark
  })

  new Interview({
    candidat,
    interviewer,
    skill_matrixes,
    interview_start,
    interview_end,
    finish_feedback_text,
    finish_mark: Math.round(finish_mark / skill_matrixes.length)
  }).save()
    .then(async (newData) => {
      let result = await Interview.findOne({ _id: newData._id }).populate(['candidat', 'interviewer']).lean()

      let candidat_user = await user.findOne({ _id: result.candidat.user }).lean()

      let html = `
        <h2>Suhbat natijasi</h2>
        `

      sendemail(candidat_user.email, 'Suhbatdan otish', html)
        .then(() => {
          res.status(201).json({
            msg: "Suhbatgaa taklif jonatildi",
            result
          })
        })
        .catch(err => {
          res.status(500)
            .json({
              err
            })
        })
    }).catch(e => {
      res.status(500).json({
        e
      })
    })
}


module.exports = {
  add_interview
}