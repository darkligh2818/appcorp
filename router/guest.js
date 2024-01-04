const router = require('express').Router()

const { show_page, add_candidat } = require('../controllers/guest')

router
  .route('/candidat')
  .get(show_page)
  .post(add_candidat)

module.exports = router