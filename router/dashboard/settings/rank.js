const router = require('express').Router()

const {
  all_ranks,
  add_rank,
  delete_rank,
  edit_rank,
  save_rank,
  status_rank
} = require('../../../controllers/dashboard/settings/rank')

const { secureAuth } = require('../../../middleware/auth')

router
  .route('/')
  .all(secureAuth)
  .get(all_ranks)
  .post(add_rank)

router
  .route('/delete/:id')
  .all(secureAuth)
  .get(delete_rank)

router
  .route('/edit/:id')
  .all(secureAuth)
  .get(edit_rank)
  .post(save_rank)

router
  .route('/status/:id')
  .all(secureAuth)
  .get(status_rank)

module.exports = router


