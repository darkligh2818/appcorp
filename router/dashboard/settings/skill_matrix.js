const router = require('express').Router()

const {
  all_skill_matrixs,
  add_skill_matrix,
  delete_skill_matrix,
  edit_skill_matrix,
  save_skill_matrix,
  status_skill_matrix,
  add_page,
} = require('../../../controllers/dashboard/settings/skill_matrix')

const { secureAuth } = require('../../../middleware/auth')

router
  .route('/')
  .all(secureAuth)
  .get(all_skill_matrixs)
  .post(add_skill_matrix)

router
  .route('/delete/:id')
  .all(secureAuth)
  .get(delete_skill_matrix)



router
  .route('/status/:id')
  .all(secureAuth)
  .get(status_skill_matrix)


router
  .route('/add')
  .all(secureAuth)
  .get(add_page)

router
  .route('/:id')
  .all(secureAuth)
  .get(edit_skill_matrix)
  .post(save_skill_matrix)

module.exports = router


