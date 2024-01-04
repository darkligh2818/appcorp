const router = require('express').Router()

const { secureAuth } = require('../../middleware/auth')

const { new_worker, all_workers, add_worker, edit_worker } = require('../../controllers/api/hr/worker')

router
  .route('/')
  .all(secureAuth)
  .get(all_workers)

router
  .route('/new')
  .all(secureAuth)
  .get(new_worker)
  .post(add_worker)
router
  .route('/:id')
  .all(secureAuth)
  .get(edit_worker)

module.exports = router