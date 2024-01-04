const mongoose = require('mongoose')

require('../../models/settings/rank')
require('../../models/settings/department')
require('../../models/workers/worker')
require('../../models/interview/skill_matrix')
require('../../models/project/client')

const target = ['rank', 'department', 'worker', 'skill_matrix', 'client']

const populate = {
  'worker': ['department', 'rank', 'user']
}

// const filterTemp = {
//   'rank': { 'title': { $regex: new RegExp(title.toLowerCase(), 'i') } },
//   'salary': { $gte: 3500000 }
// }



// hamma malumotni olib beradi
const all = async (req, res) => {
  let model = req.params.model
  let limit = req.params.limit || 20
  let page = req.params.page || 1
  let skip = (page - 1) * limit

  let fil = req.query.search || {}
  let title = req.query.title || null
  let select = req.query.select || null

  if (title) {
    fil = {
      ...fil,
      'rank': { 'title': { $regex: new RegExp(title.toLowerCase(), 'i') } },
    }
  }


  if (!target.includes(model)) {
    res.status(500).json({
      msg: 'Bunday model yoq, ukam'
    })
  }

  const dynamicModel = mongoose.model(model)

  const data = await dynamicModel
    .find({ ...fil })
    .populate(populate[model] || null)
    .select(select)
    .skip(skip)
    .limit(limit)
    .lean()

  const count = await dynamicModel.find().count()

  if (req.params?.inline) {
    return {
      msg: 'Malumotlar',
      count,
      data,
    }
  }

  res.json({
    msg: 'Malumotlar',
    count,
    data,
  })




}

// bitta malumotni olish
const get = async (req, res) => {
  if (req.params.id) {
    let _id = req.params.id
    let select = req.params.select || [] // ['title', '_id']
    let model = req.params.model || null

    if (!target.includes(model)) {
      res.status(500).json({
        msg: 'Bunday model yoq, ukam'
      })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(500).json({
        msg: 'id is not valid'
      })
    }

    const dynamicModel = mongoose.model(model)
    let data = await dynamicModel.findById(_id)
      .select(select)
      .populate(populate[model] || [])
      .lean()

    res.json(data)

  } else {
    res.json({
      msg: 'no'
    })
  }
}

// malumot qoshish
const add = async (req, res) => {
  let model = req.params.model // rank, document, salary

  if (!target.includes(model)) {
    res.status(500).json({
      msg: 'Bunday model yoq, ukam'
    })
  }

  const dynamicModel = mongoose.model(model)

  const newData = new dynamicModel({ ...req.body, createdAt: new Date() })
  newData
    .save()
    .then(async (data) => {
      let result = await dynamicModel
        .findById(data._id)
        .populate(populate[model])
        .lean()

      res.status(201).json({ result })
    })
    .catch(error => {
      res.status(500).json({ error })
    })
}

// malumotni yangilash
const save = async (req, res) => {
  let model = req.params.model || null
  if (!target.includes(model)) {
    res.status(500).json({
      msg: 'Bunday model yoq, ukam'
    })
  }
  let _id = req.body._id || null

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({
      msg: 'id is not valid'
    })
  }

  const dynamicModel = mongoose.model(model)

  await dynamicModel.findByIdAndUpdate(_id, { ...req.body }, { new: true })

  let data = await dynamicModel.findById(_id).populate(populate[model] || null).lean()

  res.json(data)
}

// malumotni ochirish
const remove = async (req, res) => {
  if (req.params.id) {
    let _id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(500).json({
        msg: 'id is not valid'
      })
    }

    let model = req.params.model || null
    if (!target.includes(model)) {
      res.status(500).json({
        msg: 'Bunday model yoq, ukam'
      })
    }

    const dynamicModel = mongoose.model(model)
    const data = await dynamicModel.findById(_id).lean()
    await dynamicModel.findByIdAndDelete(_id)

    res.json({
      msg: 'deleted',
      data
    })

  } else {
    res.status(500).json({
      msg: 'id berilmagan'
    })
  }
}

// statusni ozgartirish
const status = async (req, res) => {
  if (req.params.id) {
    let _id = req.params.id
    let status = req.params.status || null

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(500).json({
        msg: 'id is not valid'
      })
    }

    let model = req.params.model || null
    if (!target.includes(model)) {
      res.status(500).json({
        msg: 'Bunday model yoq, ukam'
      })
    }

    const dynamicModel = mongoose.model(model)

    let checkData = await dynamicModel.findById(_id).lean()

    if (!checkData) {
      res.status(500).json({
        msg: 'bunday id mavjud emas'
      })
    }

    const data = await dynamicModel.findById(_id).lean()
    data.status = status || !data.status  // true = !true => false 
    dynamicModel
      .findByIdAndUpdate(_id, data, { new: true })
      .lean()
      .then(() => {
        res.json(data)
      })
      .catch((err) => {
        res.status(500).json({
          msg: err
        })
      })

  } else {
    res.status(500).json({
      msg: 'id berilmagan'
    })
  }
}

module.exports = {
  all,
  get,
  add,
  save,
  remove,
  status
}


