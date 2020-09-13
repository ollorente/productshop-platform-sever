const {
  pagination,
  userInfo
} = require('../helpers')

const app = {}

const {
  Admin
} = require('../models')

app.create = async (req, res, next) => {
  const {
    userId,
    isLock
  } = req.body

  const user = await userInfo(userId)

  const adminInfo = await adminInfo(user._id)

  if (!user) {
    return res.status(500).json({
      error: 'User don\'t found!.'
    })
  }

  if (adminInfo) {
    return res.status(500).json({
      error: 'Admin exist!.'
    })
  }

  if (!superuser) {
    return res.status(403).json({
      error: 'Access denied!.'
    })
  }

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

  if (!admin && !superuser) {
    return res.status(403).json({
      error: 'Access denied!.'
    })
  }

  let result, count
  try {
    if (superuser) {
      result = await Admin.find({}, {
        _id: 0
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
        _id: 0
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

  const user = await userInfo(id)

  if (!admin && !superuser) {
    return res.status(403).json({
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
      _id: 0
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

  const user = await userInfo(id)

  if (!superuser) {
    return res.status(403).json({
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
    result = await Admin.findOneAndUpdate({
      userId: user._id
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

  const user = await userInfo(id)

  if (!superuser) {
    return res.status(403).json({
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
