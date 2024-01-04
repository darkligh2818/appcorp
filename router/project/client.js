const router = require('express').Router()

const { auth } = require('../../middleware/auth')

const { new_client, all_clients, status_client } = require('../../controllers/api/project/client')

router
  .route('/')
  .all(auth)
  .get(all_clients)

router
  .route('/new')
  .all(auth)
  .get(new_client)
router
  .route('/:id')
  .all(auth)

router
  .route('/status/:id')
  .all(auth)
  .get(status_client)

module.exports = router