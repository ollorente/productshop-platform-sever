const fs = require('fs-extra')

const cloudinary = require('cloudinary')
require('dotenv').config()
require('../helpers/cloudinary')

const {
  pagination,
  userInfo
} = require('../helpers')

const app = {}

const {
  Admin,
  Photo,
  Product,
  User,
  Superuser
} = require('../models')

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

    count = await User.countDocuments()

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

  let result
  try {
    result = await User.findOne({
      uid: id
    }, {
      _id: 0
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
  const {
    id
  } = req.params

  const update = req.body

  const user = await userInfo(id)

  if (!admin && !superuser) {
    return res.status(403).json({
      error: 'Access denied!.'
    })
  }

  if (!user) {
    return res.status(500).json({
      error: 'User not found!.'
    })
  }

  if (req.file) {
    const photo = await cloudinary
      .v2
      .uploader
      .upload(req.file.path, {
        folder: `${user.uid}/`
      },
      function (error, result) {
        console.log(result, error)
      })

    update.image = photo.secure_url
    update.publicId = photo.public_id

    cloudinary
      .uploader
      .destroy(user.publicId,
        function (result) {
          console.log(result)
        })
  }

  let result
  try {
    result = await User.findOneAndUpdate({
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
      error: 'User not found!.'
    })
  }

  let result
  try {
    await Product.find({
      userId: user._id
    }, (error, products) => {
      if (error) {
        return res.status(500).json({
          error: error.toString()
        })
      }

      products.forEach(async e => {
        await Photo.find({
          productId: e._id
        }, (error, photos) => {
          if (error) {
            return res.status(500).json({
              error: error.toString()
            })
          }

          photos.forEach(async e => {
            await Photo.deleteOne({
              _id: e._id
            })
          })
        })

        await Product.deleteOne({
          _id: e._id
        })
      })
    })

    await Admin.deleteOne({
      userId: user._id
    })

    await Superuser.deleteOne({
      userId: user._id
    })

    result = await User.deleteOne({
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

app.profile = async (req, res, next) => {
  let result
  try {
    result = await User.findOne({
      _id: req.user._id
    }, {
      _id: 0,
      password: 0,
      publicId: 0,
      isLock: 0
    })
      .populate({
        path: '_products',
        select: '-_id title slug barcode _photos _photosCount createdAt',
        populate: {
          path: '_photos',
          select: '-_id image order',
          options: {
            limit: 1,
            sort: {
              order: 1
            }
          }
        },
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
