const router = require('express').Router()
const {
  verifyToken
} = require('../helpers')

const {
  ADMIN,
  AUTH,
  CITY,
  COUNTRY,
  PHOTO,
  PRODUCT,
  STATE,
  USER
} = require('../controllers')

router.route('/')
  .get(verifyToken, (req, res, next) => res.status(200).json({ message: 'Welcome to ProductShop APIRestful!' }))

router.route('/admins')
  .post(verifyToken, ADMIN.create)
  .get(verifyToken, ADMIN.list)

router.route('/admins/:id')
  .get(verifyToken, ADMIN.get)
  .put(verifyToken, ADMIN.update)
  .delete(verifyToken, ADMIN.remove)

router.route('/cities/:id')
  .get(verifyToken, CITY.get)
  .put(verifyToken, CITY.update)
  .delete(verifyToken, CITY.remove)

router.route('/countries')
  .post(verifyToken, COUNTRY.create)
  .get(verifyToken, COUNTRY.list)

router.route('/countries/:id')
  .get(verifyToken, COUNTRY.get)
  .put(verifyToken, COUNTRY.update)
  .delete(verifyToken, COUNTRY.remove)

router.route('/countries/:id/states')
  .post(verifyToken, STATE.create)
  .get(verifyToken, STATE.list)

router.route('/photos/:id')
  .get(verifyToken, PHOTO.get) /* TODO */
  .delete(verifyToken, PHOTO.remove) /* TODO */

router.route('/products')
  .post(verifyToken, PRODUCT.create)
  .get(verifyToken, PRODUCT.listPerUser)

router.route('/products/:id')
  .get(verifyToken, PRODUCT.get)
  .put(verifyToken, PRODUCT.update)
  .delete(verifyToken, PRODUCT.remove) /* TODO */

router.route('/products/:id/photos')
  .post(verifyToken, PHOTO.create) /* TODO */
  .get(verifyToken, PHOTO.list) /* TODO */

router.route('/states/:id')
  .get(verifyToken, STATE.get)
  .put(verifyToken, STATE.update)
  .delete(verifyToken, STATE.remove)

router.route('/states/:id/cities')
  .post(verifyToken, CITY.create)
  .get(verifyToken, CITY.list)

router.route('/users')
  .get(verifyToken, USER.list)

router.route('/users/:id')
  .get(verifyToken, USER.get)
  .put(verifyToken, USER.update)
  .delete(verifyToken, USER.remove) /* TODO */

router.route('/users/:id/products')
  .get(verifyToken, PRODUCT.list)

router.route('/login')
  .post(AUTH.login)

router.route('/profile')
  .get(verifyToken, USER.profile)

router.route('/register')
  .post(AUTH.register)

router.route('*')
  .get((req, res, next) => res.status(404).json({ error: `Page don't found!` }))

module.exports = router