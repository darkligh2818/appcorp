const User = require('../../../models/user')
const Worker = require('../../../models/workers/worker')
const Rank = require('../../../models/settings/rank')
const Department = require('../../../models/settings/department')
const path = require('path')
const bcrypt = require('bcrypt')

const { convertDate } = require('../../../utils/func')
const { all } = require('../../api/crud')

const all_workers = async (req, res) => {
  let workers = await Worker.find().populate(['department', 'rank']).sort({ _id: -1 }).lean()
  res.render('page/hr/all_worker', {
    workers: workers.map(worker => {
      return {
        ...worker,
        createdAt: convertDate(worker.createdAt)
      }
    })
  })
}

const new_worker = async (req, res) => {
  req.params.inline = true
  req.query.search = {
    status: true
  }
  req.query.select = ['_id', 'title']

  req.params.model = 'department'
  let department_result = await all(req, res)

  res.render('page/hr/new_worker', {
    departments: department_result.data,
  })
}

const add_worker = async (req, res) => {
  let photo = ''

  if (req.files) {
    const uniquePreffiex = Date.now() + '-' + Math.round(Math.random() * 1e9)
    let photo_file = req.files.photo || null

    if (photo_file) {
      photo = `assets/files/photo/${uniquePreffiex}_${photo_file.name}`
      await photo_file.mv(path.join(`${__dirname}/../../../${photo}`))
    }


    const password = await bcrypt.hash(req.body.password, 10)
    const new_user = await new User({
      email: req.body.email,
      password,
      role: 'worker',
      status: 1
    }).save()

    await new Worker({
      ...req.body,
      photo,
      user: new_user._id,
      status: true
    }).save()
      .then(() => {
        res.redirect('/hr/worker')
      })
  }
}

const edit_worker = async (req, res) => {
  if (req.params.id) {
    let _id = req.params.id
    let worker = await Worker.findById(_id).lean()
    const departments = await Department.find({ status: true }).select(['_id', 'title']).lean()
    const ranks = await Rank.find({ status: true }).select(['_id', 'title']).lean()
    const users = await User.find({ role: 'candidat' }).select(['email', 'password']).lean()
    res.render('page/hr/new_worker', {
      worker,
      departments: departments.map(department => {
        return {
          ...department,
          selected: department._id.toString() == worker.department.toString()
        }
      }),
      ranks: ranks.map(rank => {
        return {
          ...rank,
          selected: rank._id.toString() == worker.rank.toString()
        }
      }),
      users,
      edit: true
    })
  }
}


module.exports = {
  add_worker,
  new_worker,
  all_workers,
  edit_worker
}