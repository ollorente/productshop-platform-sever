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
    barcode,
    title,
    slug,
    description,
    legals
  } = req.body

  const userInfo = await User.findOne({
    uid: id,
    isLock: false
  })
  if (!userInfo) {
    return res.status(500).json({
      error: 'User not found!.'
    })
  }

  const barcodeInfo = await Product.findOne({
    barcode: barcode
  })
  if (barcodeInfo) {
    return res.status(500).json({
      error: 'Product exist!.'
    })
  }

  const newData = new Product({
    userId: userInfo._id,
    barcode: barcode,
    title,
    slug,
    description,
    legals
  })

  let result
  try {
    result = await newData.save()

    await User.findOneAndUpdate({
      uid: userInfo.uid
    }, {
      $push: {
        _products: result._id
      }
    })
    await User.findOneAndUpdate({
      uid: userInfo.uid
    }, {
      $inc: {
        _productsCount: 1
      }
    })
  } catch (error) {
    return next(error)
  }

  res.status(201).json({
    data: result
  })
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
    uid: id
  })
  if (!userInfo) {
    return res.status(500).json({
      error: 'User not found!.'
    })
  }

  let result, count
  try {
    result = await Product.find({
      userId: userInfo._id
    }, {
      _id: 0,
      title: 1,
      barcode: 1,
      isActive: 1,
      createdAt: 1,
      _photos: 1
    })
      .populate({
        path: '_photos',
        select: '-_id image order',
        options: {
          limit: 1,
          sort: {
            order: 1
          }
        }
      })
      .limit(pagination.limit(limit))
      .skip(pagination.page(page))
      .sort({
        title: 1
      })

    count = await Product.countDocuments({
      userId: userInfo._id
    })
  } catch (error) {
    return next(error)
  }

  res.status(200).json({
    data: result,
    count
  })
}

app.get = async (req, res, next) => {
  const {
    id
  } = req.params

  let result
  try {
    result = await Product.findOne({
      barcode: id
    }, {
      _id: 0,
      isLock: 0,
      __v: 0
    })
      .populate({
        path: 'userId',
        select: '-_id displayName photoURL uid',
        match: {
          isActive: true,
          isLock: false
        }
      })
  } catch (error) {
    return next(error)
  }

  res.status(200).json({
    data: result
  })
}

app.update = async (req, res, next) => {
  const {
    id
  } = req.params
  const update = req.body

  const productInfo = await Product.findOne({
    barcode: id
  })
  if (!productInfo) {
    return res.status(500).json({
      error: 'Product not found!.'
    })
  }

  let result
  try {
    result = await Product.findOneAndUpdate({
      barcode: productInfo.barcode
    }, {
      $set: update
    }, {
      new: true
    })
  } catch (error) {
    return next(error)
  }

  res.status(200).json({
    data: result
  })
}

app.remove = async (req, res, next) => {
  const {
    id
  } = req.params

  const productInfo = await Product.findOne({
    barcode: id
  })
  if (!productInfo) {
    return res.status(500).json({
      error: 'Product not found!.'
    })
  }

  let result
  try {
    await Photo.find({
      productId: productInfo._id
    }, (error, item) => {
      if (error) return res.status(500).json({
        error: `Something bad occurred: ${error}`
      })

      item.forEach(async e => {
        await Photo.deleteOne({
          productId: e._id
        })
      })
    })

    result = await User.deleteOne({
      _id: productInfo._id
    })

    await User.findOneAndUpdate({
      _id: productInfo.userId
    }, {
      $pull: {
        _products: result._id
      }
    })
    await User.findOneAndUpdate({
      _id: productInfo.userId
    }, {
      $inc: {
        _productsCount: -1
      }
    })
  } catch (error) {
    return next(error)
  }

  res.status(204).json({
    data: result
  })
}

module.exports = app
