const router = require('express').Router()

router.use('/', require('./router/main'))
router.use('/guest', require('./router/guest'))
router.use('/dashboard', require('./router/dashboard/index'))
router.use('/auth', require('./router/auth'))
router.use('/api', require('./router/api'))
router.use('/hr', require('./router/hr/index'))
router.use('/project', require('./router/project/index'))

router.use('/login', require('./router/auth/login'))

module.exports = router
