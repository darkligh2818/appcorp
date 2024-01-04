const Skill_matrix = require('../../../models/interview/skill_matrix')
const Department = require('../../../models/settings/department')
const { convertDate } = require('../../../utils/func')

const all_skill_matrixs = async (req, res) => {
  const skill_matrixs = await Skill_matrix.find().populate(['department']).sort({ _id: -1 }).lean()
  const departments = await Department.find({ status: true }).select(['_id', 'title']).lean()

  res.render('page/settings/skill_matrix', {
    skill_matrixs: skill_matrixs.map(skill_matrix => {
      return {
        ...skill_matrix,
        createdAt: convertDate(skill_matrix.createdAt)
      }
    }),
    departments
  })
}

const add_page = async (req, res) => {
  const departments = await Department.find({ status: true }).select(['_id', 'title']).lean()
  res.render('page/settings/add_skill_matrix', {
    departments
  })
}

const add_skill_matrix = async (req, res) => {
  await new Skill_matrix({ ...req.body })
    .save()
    .then(() => {
      res.redirect('/dashboard/skill_matrix')
    }).catch((err) => {
      res.redirect(`/dashboard/skill_matrix?error=${err}`)
    })
}


const delete_skill_matrix = async (req, res) => {
  if (req.params.id) {
    await Skill_matrix.findOneAndDelete({ _id: req.params.id }).lean()
    res.redirect('/dashboard/skill_matrix')
  }
}


const edit_skill_matrix = async (req, res) => {
  if (req.params.id) {
    let _id = req.params.id
    let skill_matrix = await Skill_matrix.findById(_id).lean()
    const departments = await Department.find({ status: true }).select(['_id', 'title']).lean()
    res.render('page/settings/add_skill_matrix', {
      skill_matrix,
      departments: departments.map(department => {
        return {
          ...department,
          selected: department._id.toString() == skill_matrix.department.toString()
        }
      }),
      edit: true
    })
  }
}


const save_skill_matrix = async (req, res) => {
  if (req.params.id) {
    let id = req.params.id
    req.body.questions = req.body.questions.filter(question => question.length > 0)
    await Skill_matrix.findByIdAndUpdate(id, { ...req.body }, { new: true })
    res.redirect('/dashboard/skill_matrix')
  }
}

const status_skill_matrix = async (req, res) => {
  if (req.params.id) {
    let id = req.params.id
    let skill_matrix = await Skill_matrix.findById(id).lean()
    skill_matrix.status = !skill_matrix.status
    await Skill_matrix.findByIdAndUpdate(id, skill_matrix, { new: true })
    res.redirect('/dashboard/skill_matrix')
  }
}

module.exports = {
  all_skill_matrixs,
  add_skill_matrix,
  delete_skill_matrix,
  edit_skill_matrix,
  save_skill_matrix,
  status_skill_matrix,
  add_page,
}