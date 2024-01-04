const router = require('express').Router()


router.use('/rank', require('./settings/rank'))
router.use('/department', require('./settings/department'))
router.use('/skill_matrix', require('./settings/skill_matrix'))
router.use('/interview', require('./settings/interview'))



module.exports = router