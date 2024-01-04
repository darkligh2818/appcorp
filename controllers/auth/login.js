const User = require('../../models/user')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {
  let { email, password } = req.body

  let user = await User.findOne({ email }).select(['email', 'password', 'createdAt', 'status']).lean()
  if (!user) {
    return res.status(500).send('Bunday foydalanuvchi topilmadi')
  }

  if (user.status != 1) {
    return res.status(500).send("foydalanuvchi aktivlashtirilmagan")
  }

  const comparePassword = await bcrypt.compare(password, user.password)
  if (!comparePassword) {
    return res.status(403).json("Maxfiy kalit notogri")
  }

  const token = jwt.sign({ id: user._id }, config.get('secretKey'), { expiresIn: '1d' })

  req.session.user = { id: user._id, email: user.email }
  req.session.token = token

  res.redirect('/')
}


module.exports = {
  login
}