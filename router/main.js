const router = require("express").Router()

const { secureAuth } = require('../middleware/auth')
const { home } = require("../controllers/main")

router.route('/')
  .all(secureAuth)
  .get(home)

module.exports = router
