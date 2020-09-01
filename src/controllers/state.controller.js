const {
  pagination
} = require('../helpers')

const app = {}

const {
  City,
  Country,
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

  const countryInfo = await Country.findOne({
    slug: id
  })
  if (!countryInfo) {
    return res.status(500).json({
      error: 'Country not found!'
    })
  }

  const stateInfo = await State.findOne({
    slug: slug
  })
  if (stateInfo) {
    return res.status(500).json({
      error: 'State exist!'
    })
  }

  const newData = new State({
    countryId: countryInfo._id,
    name,
    slug,
    isActive,
    _cities: [],
    _citiesCount: 0
  })

  let result
  try {
    result = await newData.save()

    await Country.findOneAndUpdate({
      _id: countryInfo._id
    }, {
      $push: {
        _states: result._id
      }
    })
    await Country.findOneAndUpdate({
      _id: countryInfo._id
    }, {
      $inc: {
        _statesCount: 1
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

  const countryInfo = await Country.findOne({
    slug: id
  })
  if (!countryInfo) {
    return res.status(500).json({
      error: 'Country not found!'
    })
  }

  let result, count
  try {
    result = await State.find({
      countryId: countryInfo._id,
      isActive: true
    }, {
      _id: 0,
      countryId: 1,
      isActive: 1,
      name: 1,
      slug: 1
    })
      .populate({
        path: 'countryId',
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
    count = await State.countDocuments({
      countryId: countryInfo._id,
      isActive: true
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
    result = await State.findOne({
      slug: id
    }, {
      _id: 0,
      _cities: 0,
      __v: 0
    })
      .populate({
        path: 'countryId',
        select: '-_id slug',
        match: {
          isActive: true
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

  const stateInfo = await State.findOne({
    slug: id
  })
  if (!stateInfo) {
    return res.status(500).json({
      error: 'State not found!'
    })
  }

  let result
  try {
    result = await State.findOneAndUpdate({
      _id: stateInfo._id
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

  const stateInfo = await State.findOne({
    slug: id
  })
  if (!stateInfo) {
    return res.status(500).json({
      error: 'State not found!'
    })
  }

  let result
  try {
    await City.find({
      stateId: stateInfo._id
    }, (error, item) => {
      if (error) {
        return res.status(500).json({
          error: `Something bad occurred: ${error}`
        })
      }

      item.forEach(async e => {
        await City.deleteOne({
          _id: e._id
        })
      })
    })

    result = await State.deleteOne({
      _id: stateInfo._id
    })

    await Country.findOneAndUpdate({
      _id: stateInfo.countryId
    }, {
      $pull: {
        _states: result._id
      }
    })
    await Country.findOneAndUpdate({
      _id: stateInfo.countryId
    }, {
      $inc: {
        _statesCount: -1
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
