const router = require('express').Router()

const {
  all_departments,
  add_department,
  delete_department,
  edit_department,
  save_department,
  status_department
} = require('../../../controllers/dashboard/settings/department')

const { secureAuth } = require('../../../middleware/auth')

router
  .route('/')
  .all(secureAuth)
  .get(all_departments)
  .post(add_department)

router
  .route('/delete/:id')
  .all(secureAuth)
  .get(delete_department)

router
  .route('/edit/:id')
  .all(secureAuth)
  .get(edit_department)
  .post(save_department)

router
  .route('/status/:id')
  .all(secureAuth)
  .get(status_department)

module.exports = router


