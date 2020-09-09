const fs = require('fs-extra')

const cloudinary = require('cloudinary')
require('dotenv').config()
require('../helpers/cloudinary')

const {
  pagination
} = require('../helpers')

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

  const userInfo = await User.findOne({
    _id: req.user._id,
    isLock: false
  })
  if (!userInfo) {
    return res.status(500).json({
      error: `Access denied!.`
    })
  }

  const productInfo = await Product.findOne({
    barcode: id,
    userId: userInfo._id,
    isLock: false
  })
  if (!productInfo) {
    return res.status(500).json({
      error: `Product don´t found!.`
    })
  }

  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: `${userInfo.uid}/${productInfo.barcode}/`
      },
      function (error, result) {
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

      res.status(201).json({
        data: info
      })
    } catch (error) {
      res.status(500).json({
        error: error.toString()
      })
    }
  }
}

app.list = async (req, res, next) => {
  const {
    id
  } = req.params

  const {
    limit,
    page
  } = req.query

  const userInfo = await User.findOne({
    _id: req.user._id,
    isLock: false
  })
  if (!userInfo) {
    return res.status(500).json({
      error: `Access denied!.`
    })
  }

  const productInfo = await Product.findOne({
    barcode: id,
    userId: userInfo._id,
    isLock: false
  })
  if (!productInfo) {
    return res.status(500).json({
      error: `Product don´t found!.`
    })
  }

  let result
  try {
    result = await Photo.find({
        productId: productInfo._id
      }, {
        productId: 1,
        image: 1,
        order: 1,
        createdAt: 1
      })
      .populate({
        path: 'productId',
        select: '-_id barcode title',
        match: {
          isLock: false
        }
      })
      .limit(pagination.limit(limit))
      .skip(pagination.page(page))
      .sort({
        order: 1
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
  const userInfo = await User.findOne({
    _id: req.user._id,
    isLock: false
  })
  if (!userInfo) {
    return res.status(500).json({
      error: `Access denied!.`
    })
  }

  const productInfo = await Product.findOne({
    barcode: id,
    userId: userInfo._id,
    isLock: false
  })
  if (!productInfo) {
    return res.status(500).json({
      error: `Product don´t found!.`
    })
  }

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
  const {
    id
  } = req.params

  const update = req.body

  const userInfo = await User.findOne({
    _id: req.user._id,
    isLock: false
  })
  if (!userInfo) {
    return res.status(500).json({
      error: `Access denied!.`
    })
  }

  const productInfo = await Product.findOne({
    barcode: id,
    userId: userInfo._id,
    isLock: false
  })
  if (!productInfo) {
    return res.status(500).json({
      error: `Product don´t found!.`
    })
  }

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