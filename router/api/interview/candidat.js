const router = require('express').Router()

const { auth } = require('../../../middleware/auth')

const { add_candidat } = require('../../../controllers/api/interview/candidat')

router.route('/')
  .all(auth)
  .post(add_candidat)

module.exports = router