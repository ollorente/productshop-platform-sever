const fs = require('fs-extra')

const cloudinary = require('cloudinary')
require('dotenv').config()
require('../helpers/cloudinary')

const app = {}

const {
  Photo,
  Product,
  User
} = require('../models')

app.create = async (req, res, next) => {
  const {
    id
  } = req.params

  const {
    order
  } = req.body

  const productInfo = await Product.findOne({
    barcode: id,
    isLock: false
  })
  if (!productInfo) {
    return res.status(500).json({
      error: 'Product not found!.'
    })
  }

  const userInfo = await User.findOne({
    _id: productInfo.userId,
    isLock: false
  })
  if (!userInfo) {
    return res.status(500).json({
      error: 'User not found or action denied'
    })
  }

  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path,
			{ folder: 'upload/' },
			function(error, result) {
				console.log(result, error)
			})


    const newData = new Photo({
      productId: productInfo._id,
      image: result.secure_url,
      publicId: result.public_id,
      order
    })

    await fs.unlink(req.file.path)

    let info
    try {
      info = await newData.save()

      await Product.findOneAndUpdate({
        _id: productInfo._id
      }, {
        $push: {
          _photos: info._id
        }
      })
      await Product.findOneAndUpdate({
        _id: productInfo._id
      }, {
        $inc: {
          _photosCount: 1
        }
      })
    } catch (error) {
      return next(error)
    }

    res.status(201).json({
      data: info
    })
  }
}

app.list = async (req, res, next) => {
  let result
  try {
    result = await 'List'
  } catch (error) {
    return next(error)
  }

  res.status(200).json({
    data: result
  })
}

app.get = async (req, res, next) => {
  let result
  try {
    result = await 'Get'
  } catch (error) {
    return next(error)
  }

  res.status(200).json({
    data: result
  })
}

app.update = async (req, res, next) => {
  let result
  try {
    result = await 'Update'
  } catch (error) {
    return next(error)
  }

  res.status(200).json({
    data: result
  })
}

app.remove = async (req, res, next) => {
  let result
  try {
    result = await 'Remove'
  } catch (error) {
    return next(error)
  }

  res.status(200).json({
    data: result
  })
}

module.exports = app