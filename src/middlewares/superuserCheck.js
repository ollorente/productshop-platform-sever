const {
  Superuser
} = require('../models')

module.exports = superuserCheck = async (req, res, next) => {
  let result
  try {
    result = await Superuser.findOne({
      userId: req.user._id,
      isLock: false
    })

    superuser = result
    next()
  } catch (error) {
    next({
      error: error.toString()
    })
  }
}
