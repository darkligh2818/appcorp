const router = require('express').Router()

const {
  all_interviews,
  add_interview,
  delete_interview,
  edit_interview,
  save_interview,
  status_interview,
  add_page,
  send_info,
} = require('../../../controllers/dashboard/settings/interview')

const { secureAuth } = require('../../../middleware/auth')

router
  .route('/')
  .all(secureAuth)
  .get(all_interviews)
  .post(add_interview)

router
  .route('/delete/:id')
  .all(secureAuth)
  .get(delete_interview)



router
  .route('/status/:id')
  .all(secureAuth)
  .get(status_interview)


router
  .route('/add')
  .all(secureAuth)
  .get(add_page)

router.get('/candidat/:id', send_info)

router
  .route('/:id')
  .all(secureAuth)
  .get(edit_interview)
  .post(save_interview)



module.exports = router


