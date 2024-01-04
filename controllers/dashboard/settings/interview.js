const Interview = require('../../../models/interview/interview')
const Department = require('../../../models/settings/department')
const Candidat = require('../../../models/interview/candidat')
const Skill_matrix = require('../../../models/interview/skill_matrix')
const Worker = require('../../../models/workers/worker')
const { convertDate } = require('../../../utils/func')

const all_interviews = async (req, res) => {
  const interviews = await Interview
    .find()
    .populate(['candidat', 'interviewer', {
      path: 'candidat',
      populate: {
        path: 'rank',
        model: 'rank'
      }
    }])
    .sort({ _id: -1 })
    .lean()



  res.render('page/hr/interview', {
    interviews: interviews.map(interview => {
      return {
        ...interview,
        createdAt: convertDate(interview.createdAt),
        finish_mark: "",
      }
    })
  })
}

const add_page = async (req, res) => {
  const candidats = await Candidat
    .find({ status: true })
    .select(['first_name', 'last_name', 'rank'])
    .populate(['rank'])
    .lean()

  res.render('page/hr/add_interview', {
    candidats
  })
}

const send_info = async (req, res) => {
  if (req.params.id) {
    let { id } = req.params

    let candidat = await Candidat.findById(id).select(['rank']).populate(['rank']).lean()
    let workers = await Worker
      .find({ department: candidat.rank?.department, status: true })
      .select(['_id', 'last_name', 'first_name', 'rank'])
      .populate(['rank'])
      .lean()

    let skill_matrix = await Skill_matrix
      .find({ department: candidat.rank?.department, status: true })
      .select(['title', 'text', 'questions'])
      .lean()

    res.json({
      workers,
      skill_matrix
    })


  }
}

const add_interview = async (req, res) => {
  let skill_matrixs = req.body.skill_matrixs

  let finish_mark = 0

  skill_matrixs = skill_matrixs?.map((item, index) => {
    return {
      skill_matrix: item,
      feedbacktext: item.feedbacktext[index],
      feedbackmark: item.feedbackmark[index],
      finish_mark: + feedbackmark
    }
  })


  await new Interview({ ...req.body }, { finish_mark: Math.round(finish_mark / skill_matrixs?.length) })
    .save()
    .then(() => {
      res.redirect('/dashboard/interview')
    }).catch((err) => {
      res.redirect(`/dashboard/interview?error=${err}`)
    })
}


const delete_interview = async (req, res) => {
  if (req.params.id) {
    await Interview.findOneAndDelete({ _id: req.params.id }).lean()
    res.redirect('/dashboard/interview')
  }
}


const edit_interview = async (req, res) => {
  if (req.params.id) {
    let _id = req.params.id
    let interview = await Interview.findById(_id).lean()
    const departments = await Department.find({ status: true }).select(['_id', 'title']).lean()
    res.render('page/hr/add_interview', {
      interview,
      departments: departments.map(department => {
        return {
          ...department,
        }
      }),
      edit: true
    })
  }
}


const save_interview = async (req, res) => {
  if (req.params.id) {
    let id = req.params.id
    req.body.questions = req.body.questions.filter(question => question.length > 0)
    await Interview.findByIdAndUpdate(id, { ...req.body }, { new: true })
    res.redirect('/dashboard/interview')
  }
}

const status_interview = async (req, res) => {
  if (req.params.id) {
    let id = req.params.id
    let interview = await Interview.findById(id).lean()
    interview.status = !interview.status
    await Interview.findByIdAndUpdate(id, interview, { new: true })
    res.redirect('/dashboard/interview')
  }
}

module.exports = {
  all_interviews,
  add_interview,
  delete_interview,
  edit_interview,
  save_interview,
  status_interview,
  add_page,
  send_info,
}