const {
    User
} = require("../models")

const userInfo = async (data) => {
    return await User.findOne({
        uid: data,
        isLock: false
    })
}

module.exports = userInfo