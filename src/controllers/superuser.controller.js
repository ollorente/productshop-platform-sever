const {
  pagination,
  superuserInfo,
  userInfo
} = require('../helpers')

const app = {}

const {
  Superuser
} = require('../models')

app.create = async (req, res, next) => {
  const {
    userId,
    isLock
  } = req.body

  const user = await userInfo(userId)

  const newData = new Superuser({
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

  if (!superuser) {
    return res.status(403).json({
      error: 'Access denied!.'
    })
  }

  let result, count
  try {
    result = await Superuser.find({
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

    count = await Superuser.countDocuments({
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
    result = await Superuser.find({
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

  const user = await superuserInfo(id)

  if (!superuser) {
    return res.status(403).json({
      error: 'Access denied!.'
    })
  }

  let result
  try {
    result = await Superuser.findOneAndUpdate({
      _id: user._id
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
  const user = await superuserInfo(id)

  if (!superuser) {
    return res.status(403).json({
      error: 'Access denied!.'
    })
  }

  let result
  try {
    result = await Superuser.deleteOne({
      _id: user._id
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
