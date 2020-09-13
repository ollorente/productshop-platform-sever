const router = require('express').Router()

const {
  verifyToken
} = require('../helpers')

const {
  AdminCheck,
  SuperuserCheck
} = require('../middlewares')

const {
  ADMIN,
  AUTH,
  CITY,
  COUNTRY,
  PHOTO,
  PRODUCT,
  STATE,
  SUPERUSER,
  USER
} = require('../controllers')

const pkg = require('../../package.json')

router.route('/')
  .get((req, res, next) => res.status(200).json({
    message: 'Welcome to ProductShop APIRestful!',
    name: pkg.name,
    desciption: pkg.description,
    author: pkg.author,
    version: pkg.version
  }))

router.route('/admins')
  .post(verifyToken, SuperuserCheck, ADMIN.create)
  .get(verifyToken, AdminCheck, SuperuserCheck, ADMIN.list)

router.route('/admins/:id')
  .get(verifyToken, AdminCheck, SuperuserCheck, ADMIN.get)
  .put(verifyToken, SuperuserCheck, ADMIN.update)
  .delete(verifyToken, SuperuserCheck, ADMIN.remove)

router.route('/cities/:id')
  .get(verifyToken, CITY.get)
  .put(verifyToken, AdminCheck, SuperuserCheck, CITY.update)
  .delete(verifyToken, AdminCheck, SuperuserCheck, CITY.remove)

router.route('/countries')
  .post(verifyToken, AdminCheck, SuperuserCheck, COUNTRY.create)
  .get(verifyToken, COUNTRY.list)

router.route('/countries/:id')
  .get(verifyToken, COUNTRY.get)
  .put(verifyToken, AdminCheck, SuperuserCheck, COUNTRY.update)
  .delete(verifyToken, AdminCheck, SuperuserCheck, COUNTRY.remove)

router.route('/countries/:id/states')
  .post(verifyToken, AdminCheck, SuperuserCheck, STATE.create)
  .get(verifyToken, AdminCheck, SuperuserCheck, STATE.list)

router.route('/photos/:id')
  .get(verifyToken, PHOTO.get) /* TODO */
  .delete(verifyToken, AdminCheck, SuperuserCheck, PHOTO.remove) /* TODO */

router.route('/products')
  .post(verifyToken, PRODUCT.create)
  .get(verifyToken, PRODUCT.listPerUser)

router.route('/products/:id')
  .get(verifyToken, PRODUCT.get)
  .put(verifyToken, AdminCheck, SuperuserCheck, PRODUCT.update)
  .delete(verifyToken, AdminCheck, SuperuserCheck, PRODUCT.remove) /* TODO */

router.route('/products/:id/photos')
  .post(verifyToken, PHOTO.create)
  .get(verifyToken, PHOTO.list)

router.route('/states/:id')
  .get(verifyToken, STATE.get)
  .put(verifyToken, AdminCheck, SuperuserCheck, STATE.update)
  .delete(verifyToken, AdminCheck, SuperuserCheck, STATE.remove)

router.route('/states/:id/cities')
  .post(verifyToken, AdminCheck, SuperuserCheck, CITY.create)
  .get(verifyToken, CITY.list)

router.route('/superusers')
  .post(SUPERUSER.create)
  .get(verifyToken, SuperuserCheck, SUPERUSER.list)

router.route('/superusers/:id')
  .get(verifyToken, SuperuserCheck, SUPERUSER.get)
  .put(verifyToken, SuperuserCheck, SUPERUSER.update)
  .delete(verifyToken, SuperuserCheck, SUPERUSER.remove)

router.route('/users')
  .get(verifyToken, AdminCheck, SuperuserCheck, USER.list)

router.route('/users/:id')
  .get(verifyToken, AdminCheck, SuperuserCheck, USER.get)
  .put(verifyToken, AdminCheck, SuperuserCheck, USER.update)
  .delete(verifyToken, AdminCheck, SuperuserCheck, USER.remove)

router.route('/users/:id/products')
  .get(verifyToken, AdminCheck, SuperuserCheck, PRODUCT.list)

router.route('/login')
  .post(AUTH.login)

router.route('/profile')
  .get(verifyToken, USER.profile)

router.route('/register')
  .post(AUTH.register)

router.route('*')
  .get((req, res, next) => res.status(404).json({
    error: 'Page don\'t found!.'
  }))

module.exports = router
