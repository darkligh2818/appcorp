const User = require('../models/user')
const Candidat = require('../models/interview/candidat')
const Rank = require('../models/settings/rank')
const path = require('path')
const bcrypt = require('bcrypt')

const show_page = async (req, res) => {
  const ranks = await Rank.find({ status: true }).lean()
  res.render('page/guest', {
    layout: 'auth',
    ranks
  })
}

const add_candidat = async (req, res) => {
  let photo = ''
  let resume = ''
  if (req.files) {
    const uniquePreffiex = Date.now() + '-' + Math.round(Math.random() * 1e9)
    let photo_file = req.files.photo || null
    let resume_file = req.files.resume || null

    if (photo_file) {
      photo = `assets/files/photo/${uniquePreffiex}_${photo_file.name}`
      await photo_file.mv(path.join(`${__dirname}/../${photo}`))
    }

    if (resume_file) {
      resume = `assets/files/resume/${uniquePreffiex}_${resume_file.name}`
      await resume_file.mv(path.join(`${__dirname}/../${resume}`))
    }
  }

  const password = await bcrypt.hash('appcorp2023', 10)
  const new_user = await new User({
    email: req.body.email,
    password,
    role: 'candidat',
    status: 0
  }).save()

  await new Candidat({
    ...req.body,
    photo,
    resume,
    user: new_user._id,
    status: true
  }).save()
    .then(() => {
      res.redirect('/guest/candidat?msg=ok')
    })
    .catch((err) => {
      console.log(err)
      res.redirect('/guest/candidat?msg=err')
    })
}

module.exports = {
  show_page,
  add_candidat
}