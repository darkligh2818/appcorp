const jwt = require('jsonwebtoken')
const config = require("config")

const decoded = (req) => {
  const token = req.headers.authorization.split(' ').at(1)
  req.user = jwt.verify(token, config.get(secretKey))
  return req.user.id
}

module.exports = {  
  decoded
}

