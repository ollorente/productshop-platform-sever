const {
  Admin
} = require('../models')

const adminInfo = async (data) => {
  return await Admin.findOne({
    userId: data,
    isLock: false
  })
}

module.exports = adminInfo
