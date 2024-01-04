const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')
const { sendemail } = require('../utils/email')

const register = async (req, res) => {
  let { email, password } = req.body
  if (!email) {
    return res.status(500).json({
      msg: 'email yozilmagan'
    })
  }

  let checkUser = await User.findOne({ email }).lean()

  if (checkUser) {
    return res.status(500).json({
      msg: 'Bunday emaildagi foydalanuvchi mavjud, ukam!'
    })
  }

  let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validRegex)) {
    res.status(500).json({
      msg: 'email notogri formatda'
    })
  }

  const hashPass = await bcrypt.hash(password, 10)


  let tempassword = ''
  while (tempassword.length < 6) {
    tempassword += Math.ceil(Math.random() * 10).toString()
  }

  let createdAt = new Date()
  let tempexp = new Date()
  tempexp.setHours(tempexp.getHours() + 1)


  const user = new User({
    email,
    password: hashPass,
    createdAt,
    tempexp,
    tempassword,
    status: 0
  })
  delete user.tempassword

  let html = `
    <h2>Hamkasblar tizimiga royhatdan otishni tugatish uchun</h2>
    <h3>Quidagi vaqtincha parolni kiriting</h3>
    <h4> ${tempassword} </h4>

    <h6> bu parol ${tempexp.toLocaleString()} gacha avtiv hisoblanadi </h6>
  `
  user.save()
    .then(result => {
      sendemail(email, 'Royhatdan otish', html)
      res.status(201).json({
        msg: "Foydalanuvchiga vaqtincha parol jonatildi",
        result
      })
    })
    .catch(err => {
      res.status(500)
        .json({
          err
        })
    })
    .catch((e) => {
      res.status(500).json({
        e
      })
    })
}

const login = async (req, res) => {
  let { email, password } = req.body

  let user = await User.findOne({ email }).select(['email', 'password', 'createdAt', 'status']).lean()
  if (!user) {
    return res.status(500).json({
      msg: "Bunday foydalanuvchi topilmadi"
    })
  }

  if (user.status != 1) {
    return res.status(500).json({
      msg: "foydalanuvchi aktivlashtirilmagan"
    })
  }

  const comparePassword = await bcrypt.compare(password, user.password)
  if (!comparePassword) {
    return res.status(403).json({
      msg: "Maxfiy kalit notogri"
    })
  }

  const token = jwt.sign({ id: user._id }, config.get('secretKey'), { expiresIn: '1d' })

  delete user.password
  res.json({
    msg: 'Tizimga hush kelibsiz',
    token,
    user
  })
}


const active_user = async (req, res) => {
  let { email, tempassword } = req.body

  let user = await User.findOne({ email }).lean()

  if (!user) {
    return res.status(500).json({
      msg: 'Bunday emailda foydalanuvchi yoq'
    })
  }

  if (user.status == 1) {
    return res.status(500).json({
      msg: 'foydalanuvchi allaqachon aktivlashtirilgan'
    })
  }

  if (tempassword !== user.tempassword) {
    return res.status(500).json({
      msg: 'Yozilgan vaqtinchalik kod notogri'
    })
  }

  let now = new Date()

  if (user.tempexp.valueOf() < now.valueOf()) {
    return res.status(500).json({
      msg: 'vaqtincha parol vaqti otib ketgan'
    })
  }

  user.status = 1
  await User.findByIdAndUpdate(user._id, user, { new: true })

  res.json({
    msg: 'foydalanuvchi aktivlashtirildi'
  })
}



/*
  1. user -> email
  2. vaqtincha password. !user password
  3. tastiqlasa -> true -> status: 0
  4. yangidan royhatdan otmoqchi bolsa -> X
  5. Tizimga kirishda rmail/password -> ! hozir vaqtincha password ketdi.

  6. email -> vaqtincha password
*/

/*

  1. emailni jonatamiz 
  2. vaqtincha password. !user password emas 
  3. tastiqlasa -> true -> status: 0
  4. 

*/


module.exports = {
  register,
  login,
  active_user,
}