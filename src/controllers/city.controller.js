const {
  pagination
} = require('../helpers')

const app = {}

const {
  City,
  State
} = require('../models')

app.create = async (req, res, next) => {
  const {
    id
  } = req.params
  const {
    name,
    slug,
    isActive
  } = req.body

  const stateInfo = await State.findOne({
    slug: id
  })
  if (!stateInfo) {
    return res.status(500).json({
      error: 'State not found!'
    })
  }

  const cityInfo = await City.findOne({
    slug: slug
  })
  if (cityInfo) {
    return res.status(500).json({
      error: 'City exist!'
    })
  }

  const newData = new City({
    stateId: stateInfo._id,
    name,
    slug,
    isActive
  })

  let result
  try {
    result = await newData.save()

    await State.findOneAndUpdate({
      _id: stateInfo._id
    }, {
      $push: {
        _cities: result._id
      }
    })

    await State.findOneAndUpdate({
      _id: stateInfo._id
    }, {
      $inc: {
        _citiesCount: 1
      }
    })

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
    id
  } = req.params

  const {
    limit,
    page
  } = req.query

  const stateInfo = await State.findOne({
    slug: id
  })
  if (!stateInfo) {
    return res.status(500).json({
      error: 'State not found!'
    })
  }

  let result, count
  try {
    result = await City.find({
      stateId: stateInfo._id,
      isActive: true
    }, {
      _id: 0,
      stateId: 1,
      isActive: 1,
      name: 1,
      slug: 1
    })
      .populate({
        path: 'stateId',
        select: '-_id slug',
        match: {
          isActive: true
        }
      })
      .limit(pagination.limit(limit))
      .skip(pagination.page(page))
      .sort({
        name: 1
      })

    count = await City.countDocuments({
      stateId: stateInfo._id,
      isActive: true
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

  let result
  try {
    result = await City.findOne({
      slug: id
    }, {
      _id: 0,
      _cities: 0
    })
      .populate({
        path: 'stateId',
        select: '-_id slug',
        match: {
          isActive: true
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

  const cityInfo = await City.findOne({
    slug: id
  })
  if (!cityInfo) {
    return res.status(500).json({
      error: 'City not found!'
    })
  }

  let result
  try {
    result = await City.findOneAndUpdate({
      _id: cityInfo._id
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

  const cityInfo = await City.findOne({
    slug: id
  })
  if (!cityInfo) {
    return res.status(500).json({
      error: 'City not found!'
    })
  }

  let result
  try {
    result = await City.deleteOne({
      _id: cityInfo._id
    })

    await State.findOneAndUpdate({
      _id: cityInfo.stateId
    }, {
      $pull: {
        _cities: cityInfo._id
      }
    })

    await State.findOneAndUpdate({
      _id: cityInfo.stateId
    }, {
      $inc: {
        _citiesCount: -1
      }
    })

    res.status(204).json({
      data: result
    })
  } catch (error) {
    res.status(500).json({
      error: error.toString()
    })
  }
}

module.exports = app
