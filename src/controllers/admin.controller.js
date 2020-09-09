const {
    adminInfo,
    authUser,
    pagination,
    superuserInfo,
    userInfo
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

    const userAuth = await authUser(req.user._id)

    const user = await userInfo(userId)

    const admin = await adminInfo(user._id)

    const superuser = await superuserInfo(userAuth._id)

    if (!user) return res.status(500).json({
        error: `User don't found!.`
    })

    if (admin) return res.status(500).json({
        error: `Admin exist!.`
    })

    if (!superuser) return res.status(400).json({
        error: `Access denied!.`
    })

    const newData = new Admin({
        userId: user._id,
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

    const userAuth = await authUser(req.user._id)

    const admin = await adminInfo(userAuth._id)

    const superuser = await superuserInfo(userAuth._id)

    if (!admin && !superuser) {
        return res.status(500).json({
            error: 'Access denied!.'
        })
    }

    let result, count
    try {
        if (superuser) {
            result = await Admin.find({}, {
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
                .sort({
                    userId: 1
                })

            count = await Admin.countDocuments({
                isLock: false
            })
        } else {
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
                .sort({
                    userId: 1
                })

            count = await Admin.countDocuments({
                isLock: false
            })
        }

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
    const {
        id
    } = req.params

    const userAuth = await authUser(req.user._id)

    const admin = await adminInfo(userAuth._id)

    const superuser = await superuserInfo(userAuth._id)

    const user = await userInfo(id)

    if (!userAuth && !admin && !superuser) {
        return res.status(500).json({
            error: 'Access denied!.'
        })
    }

    if (!user) {
        return res.status(500).json({
            error: 'User don´t found!.'
        })
    }

    let result
    try {
        result = await Admin.find({
                userId: user._id
            }, {
                _id: 0,
                __v: 0
            })
            .populate({
                path: 'userId',
                select: '-_id displayName phoneNumber photoURL uid isActive isLock createdAt'
            })

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
    const {
        id
    } = req.params

    const update = req.body

    const userAuth = await authUser(req.user._id)

    const superuser = await superuserInfo(userAuth._id)

    if (!superuser) {
        return res.status(500).json({
            error: 'Access denied!.'
        })
    }

    const userInfo = await User.findOne({
        uid: id
    })
    if (!userInfo) {
        return res.status(500).json({
            error: 'User don´t found!.'
        })
    }

    let result
    try {
        result = await Admin.findOneAndUpdate({
            userId: userInfo._id
        }, {
            $set: update
        }, {
            new: true
        })

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
    const {
        id
    } = req.params

    const userAuth = await authUser(req.user._id)

    const superuser = await superuserInfo(userAuth._id)

    const user = await userInfo(id)

    if (!userAuth && !superuser) {
        return res.status(500).json({
            error: 'Access denied!.'
        })
    }

    if (!user) {
        return res.status(500).json({
            error: 'User don´t found!.'
        })
    }

    let result
    try {
        result = await Admin.deleteOne({
            userId: user._id
        })

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