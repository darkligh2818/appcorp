const config = require('config')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    const token = req.session?.token || req.headers.authorization.split(' ').at(1)
    req.user = jwt.verify(token, config.get('secretKey'))
    next()
  } catch (e) {
    return res.status(403).json({ msg: 'Tizimga kirishda muommo bor' })
  }
}

const secureAuth = async (req, res, next) => {
  try {
    jwt.verify(req.session.token, config.get('secretKey'))
    next()
  } catch (e) {
    console.log(e)
    return res.redirect('/login')
  }
}

module.exports = {
  auth,
  secureAuth
}