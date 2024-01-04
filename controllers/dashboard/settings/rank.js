const Rank = require('../../../models/settings/rank')
const Department = require('../../../models/settings/department')
const { convertDate } = require('../../../utils/func')

const all_ranks = async (req, res) => {
  const ranks = await Rank.find().populate(['department']).sort({ _id: -1 }).lean()
  const departments = await Department.find({ status: true }).select(['_id', 'title']).lean()

  res.render('page/settings/rank', {
    ranks: ranks.map(rank => {
      return {
        ...rank,
        createdAt: convertDate(rank.createdAt)
      }
    }),
    departments
  })
}

const add_rank = async (req, res) => {
  await new Rank({ ...req.body })
    .save()
    .then(() => {
      res.redirect('/dashboard/rank')
    }).catch((err) => {
      res.redirect(`/dashboard/rank?error=${err}`)
    })
}


const delete_rank = async (req, res) => {
  if (req.params.id) {
    await Rank.findOneAndDelete({ _id: req.params.id }).lean()
    res.redirect('/dashboard/rank')
  }
}

const edit_rank = async (req, res) => {
  if (req.params.id) {
    let _id = req.params.id
    let rank = await Rank.findById(_id).lean()
    const departments = await Department.find({ status: true }).select(['_id', 'title']).lean()
    const ranks = await Rank.find().populate(['department']).sort({ _id: -1 }).lean()
    res.render('page/settings/rank', {
      ranks: ranks.map(item => {
        return {
          ...item,
          createdAt: convertDate(item.createdAt)
        }
      }),
      rank,
      departments: departments.map(department => {
        return {
          ...department,
          selected: department._id.toString() == rank.department.toString()
        }
      }),
      edit: true
    })
  }
}


const save_rank = async (req, res) => {
  if (req.params.id) {
    let id = req.params.id
    await Rank.findByIdAndUpdate(id, { ...req.body }, { new: true })
    res.redirect('/dashboard/rank')
  }
}

const status_rank = async (req, res) => {
  if (req.params.id) {
    let id = req.params.id
    let rank = await Rank.findById(id).lean()
    rank.status = !rank.status
    await Rank.findByIdAndUpdate(id, rank, { new: true })
    res.redirect('/dashboard/rank')
  }
}

module.exports = {
  all_ranks,
  add_rank,
  delete_rank,
  edit_rank,
  save_rank,
  status_rank
}