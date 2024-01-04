const { auth } = require("../../middleware/auth")

const router = require('express').Router()

const {
  all,
  get,
  add,
  save,
  remove,
  status
} = require('../../controllers/api/crud')

router.route('/:model')
  .all(auth)
  .get(all)
  .post(add)
  .put(save)


router.route('/:model/:id')
  .all(auth)
  .get(get)
  .delete(remove)

router.route('/:model/:status/:id')
  .all(auth)
  .get(status)


module.exports = router