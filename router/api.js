const router = require("express").Router()

router.use('/crud', require('./api/crud'))
router.use('/interview', require('./api/interview/index'))

module.exports = router