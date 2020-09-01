const router = require('express').Router()

const {
  CITY,
  COUNTRY,
  PHOTO,
  PRODUCT,
  STATE,
  USER
} = require('../controllers')

router.route('/')
  .get((req, res, next) => {
    res.status(200).json({
      message: 'Hello, world!'
    })
  })

router.route('/cities/:id')
  .get(CITY.get)
  .put(CITY.update)
  .delete(CITY.remove)

router.route('/countries')
  .post(COUNTRY.create)
  .get(COUNTRY.list)

router.route('/countries/:id')
  .get(COUNTRY.get)
  .put(COUNTRY.update)
  .delete(COUNTRY.remove)

router.route('/countries/:id/states')
  .post(STATE.create)
  .get(STATE.list)

router.route('/photos/:id')
  .get(PHOTO.get) /* TODO */
  .delete(PHOTO.remove) /* TODO */

router.route('/products/:id')
  .get(PRODUCT.get)
  .put(PRODUCT.update)
  .delete(PRODUCT.remove) /* TODO */

router.route('/products/:id/photos')
  .post(PHOTO.create) /* TODO */
  .get(PHOTO.list) /* TODO */

router.route('/states/:id')
  .get(STATE.get)
  .put(STATE.update)
  .delete(STATE.remove)

router.route('/states/:id/cities')
  .post(CITY.create)
  .get(CITY.list)

router.route('/users')
  .post(USER.create)
  .get(USER.list)

router.route('/users/:id')
  .get(USER.get)
  .put(USER.update)
  .delete(USER.remove) /* TODO */

router.route('/users/:id/products')
  .post(PRODUCT.create)
  .get(PRODUCT.list)

router.route('*')
  .get((req, res, next) => {
    res.status(404).json({
      error: 'Page don\'t found!'
    })
  })

module.exports = router
