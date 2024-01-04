const { add_interview } = require('../../../controllers/api/interview')
const { auth } = require('../../../middleware/auth')

const router = require('express').Router()

router.route('/').all(auth).post(add_interview)
router.use('/candidat', require('./candidat'))

module.exports = router