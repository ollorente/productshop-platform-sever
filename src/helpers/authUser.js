const {
    User
} = require("../models")

const authUser = async (data) => {
    return await User.findOne({
        _id: data,
        isLock: false
    })
}

module.exports = authUser