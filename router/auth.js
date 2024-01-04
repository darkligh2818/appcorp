const router = require('express').Router()

const { register, login, active_user, } = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/active', active_user)

module.exports = router