const {
  Admin
} = require('../models')

module.exports = adminCheck = async (req, res, next) => {
  let result
  try {
    result = await Admin.findOne({
      userId: req.user._id,
      isLock: false
    })

    admin = result
    next()
  } catch (error) {
    next({
      error: error.toString()
    })
  }
}
