const {
    pagination
} = require('../helpers')

const app = {}

const {
    Admin,
    User,
    Superuser
} = require('../models')

app.create = async (req, res, next) => {
    const {
        userId,
        isLock
    } = req.body

    const userAuth = await User.findOne({
        _id: req.user._id,
        isLock: false
    })
    if (!userAuth) return res.status(500).json({
        error: `Access denied!.`
    })

    const userInfo = await User.findOne({
        uid: userId,
        isLock: false
    })
    if (!userInfo) return res.status(500).json({
        error: `User don't exist!.`
    })

    const adminInfo = await Admin.findOne({
        userId: userInfo._id
    })
    if (adminInfo) return res.status(500).json({
        error: `Admin exist!.`
    })

    const newData = new Admin({
        userId: userInfo._id,
        isLock
    })

    let result
    try {
        result = await newData.save()

        res.status(201).json({
            data: result
        })
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }
}

app.list = async (req, res, next) => {
    const {
        limit,
        page
    } = req.query

    const userAuth = await User.findOne({
        _id: req.user._id,
        isLock: false
    })
    if (!userAuth) return res.status(500).json({
        error: `Access denied!.`
    })

    const adminInfo = await Admin.findOne({
        userId: userAuth._id,
        isLock: false
    })

    const superuserInfo = await Superuser.findOne({
        userId: userAuth._id,
        isLock: false
    })

    if (!adminInfo && !superuserInfo) return res.status(500).json({
        error: `Access denied!.`
    })

    let result, count
    try {
        result = await Admin.find({
                isLock: false
            }, {
                _id: 0,
                __v: 0
            }).populate({
                path: 'userId',
                select: '-_id displayName photoURL uid',
                match: {
                    isLock: false
                }
            })
            .limit(pagination.limit(limit))
            .skip(pagination.page(page))

        count = await Admin.countDocuments({
            isLock: false
        })

        res.status(200).json({
            data: result,
            count
        })
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }
}

app.get = async (req, res, next) => {
    let result
    try {
        result = await 'Get'

        res.status(200).json({
            data: result
        })
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }
}

app.update = async (req, res, next) => {
    let result
    try {
        result = await 'Update'

        res.status(200).json({
            data: result
        })
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }
}

app.remove = async (req, res, next) => {
    let result
    try {
        result = await 'Remove'

        res.status(200).json({
            data: result
        })
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }
}

module.exports = app