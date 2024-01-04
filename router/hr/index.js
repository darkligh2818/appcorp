const router = require('express').Router()

router.use('/worker', require('./worker'))

module.exports = router