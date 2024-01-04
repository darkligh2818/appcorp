const router = require('express').Router()

const { login } = require('../../controllers/auth/login')

router.get('/', (req, res) => {
  res.render('page/login', {
    layout: 'auth'
  })
})

router.post('/', login)

module.exports = router