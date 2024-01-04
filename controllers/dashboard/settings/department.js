const Department = require('../../../models/settings/department')
const { convertDate } = require('../../../utils/func')

const all_departments = async (req, res) => {
  const departments = await Department.find().sort({ _id: -1 }).lean()

  res.render('page/settings/department', {
    departments: departments.map(department => {
      return {
        ...department,
        createdAt: convertDate(department.createdAt)
      }
    })
  })
}

const add_department = async (req, res) => {
  const { title } = req.body
  await new Department({ title }).save()
  res.redirect('/dashboard/department')
}


const delete_department = async (req, res) => {
  if (req.params.id) {
    await Department.findOneAndDelete({ _id: req.params.id }).lean()
    res.redirect('/dashboard/department')
  }
}

const edit_department = async (req, res) => {
  if (req.params.id) {
    let _id = req.params.id
    let department = await Department.findById(_id).lean()
    const departments = await Department.find().sort({ _id: -1 }).lean()
    res.render('page/settings/department', {
      departments: departments.map(item => {
        return {
          ...item,
          createdAt: convertDate(item.createdAt)
        }
      }),
      department,
      edit: true
    })
  }
}


const save_department = async (req, res) => {
  if (req.params.id) {
    let id = req.params.id
    let department = await Department.findById(id).lean()
    department.title = req.body.title
    await Department.findByIdAndUpdate(id, department, { new: true })
    res.redirect('/dashboard/department')
  }
}

const status_department = async (req, res) => {
  if (req.params.id) {
    let id = req.params.id
    let department = await Department.findById(id).lean()
    department.status = !department.status
    await Department.findByIdAndUpdate(id, department, { new: true })
    res.redirect('/dashboard/department')
  }
}

module.exports = {
  all_departments,
  add_department,
  delete_department,
  edit_department,
  save_department,
  status_department
}