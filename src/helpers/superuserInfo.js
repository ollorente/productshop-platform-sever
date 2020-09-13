const {
  Superuser
} = require('../models')

const superuserInfo = async (data) => {
  return await Superuser.findOne({
    userId: data,
    isLock: false
  })
}

module.exports = superuserInfo
