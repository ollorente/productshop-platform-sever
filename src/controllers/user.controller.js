const {
  pagination
} = require('../helpers')

const app = {}

const {
  User
} = require('../models')

/* app.create = async (req, res, next) => {
  const {
    displayName,
    email,
    phoneNumber,
    photoURL,
    providerId,
    uid
  } = req.body

  if (email === '') {
    return res.status(500).json({
      error: 'Email is required!.'
    })
  }

  const emailInfo = await User.findOne({
    email: email
  })
  if (emailInfo) {
    return res.status(500).json({
      error: 'Email exist!.'
    })
  }

  if (uid === '') {
    return res.status(500).json({
      error: 'UID is required.'
    })
  }

  const uidInfo = await User.findOne({
    uid: uid
  })
  if (uidInfo) {
    return res.status(500).json({
      error: 'UID exist!.'
    })
  }

  const newData = new User({
    displayName,
    email,
    phoneNumber,
    photoURL,
    providerId,
    uid
  })

  let result
  try {
    result = await newData.save()

    res.status(200).json({
      data: result
    })
  } catch (error) {
    res.status(500).json({
      error: error.toString()
    })
  }
} */

app.list = async (req, res, next) => {
  const {
    limit,
    page
  } = req.query

  let result
  try {
    result = await User.find({}, {
      _id: 0,
      displayName: 1,
      uid: 1,
      isActive: 1,
      isLock: 1
    })
      .limit(pagination.limit(limit))
      .skip(pagination.page(page))
      .sort({
        displayName: 1
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

app.get = async (req, res, next) => {
  const {
    id
  } = req.params

  let result
  try {
    result = await User.findOne({
      uid: id
    }, {
      _id: 0,
      __v: 0
    })
      .populate({
        path: '_products',
        select: '-_id barcode title',
        options: {
          limit: 10,
          sort: {
            title: 1
          }
        },
        match: {
          isActive: true,
          isLock: false
        }
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
  const userInfo = await User.findOne({
    _id: req.user._id
  })
  if (!userInfo) {
    return res.status(500).json({
      error: 'User not found!.'
    })
  }

  let result
  try {
    result = await User.findOneAndUpdate({
      _id: userInfo._id
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
  const userInfo = await User.findOne({
    _id: req.user._id
  })
  if (!userInfo) {
    return res.status(500).json({
      error: 'User not found!.'
    })
  }

  let result
  try {
    result = await User.deleteOne({
      _id: userInfo._id
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

app.profile = async (req, res, next) => {
  let result
  try {
    result = await User.findOne({
      _id: req.user._id
    }, {
      _id: 0,
      password: 0,
      isLock: 0,
      __v: 0
    })
      .populate({
        path: '_products',
        select: '-_id',
        options: {
          limit: 10,
          sort: {
            title: 1
          }
        },
        match: {
          isActive: true,
          isLock: false
        }
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
