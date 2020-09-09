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
    name,
    slug,
    code,
    currency,
    isActive
  } = req.body

  const countryInfo = await Country.findOne({
    slug: slug
  })
  if (countryInfo) {
    return res.status(500).json({
      error: 'Country exist!'
    })
  }

  const newData = new Country({
    name,
    slug,
    code,
    currency,
    isActive,
    _states: [],
    _statesCount: 0
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

  let result, count
  try {
    result = await Country.find({
        isActive: true
      }, {
        _id: 0,
        _statesCount: 1,
        name: 1,
        code: 1,
        slug: 1,
        isActive: 1
      }).limit(pagination.limit(limit))
      .skip(pagination.page(page))
      .sort({
        name: 1
      })

    count = await Country.countDocuments({
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
    result = await Country.findOne({
        slug: id
      }, {
        _id: 0,
        __v: 0
      })
      .populate({
        path: '_states',
        select: '-_id name slug isActive',
        match: {
          isActive: true
        },
        options: {
          limit: 10,
          sort: {
            name: 1
          }
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

  const countryInfo = await Country.findOne({
    slug: id
  })
  if (!countryInfo) {
    return res.statuc(500).json({
      error: 'Country not found!'
    })
  }

  let result
  try {
    result = await Country.findOneAndUpdate({
      _id: countryInfo._id
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

  const countryInfo = await Country.findOne({
    slug: id
  })
  if (!countryInfo) {
    return res.statuc(500).json({
      error: 'Country not found!'
    })
  }

  let result
  try {
    await State.find({
      countryId: countryInfo._id
    }, (error, state) => {
      if (error) {
        return res.status(500).json({
          error: `Something bad occurred: ${error}`
        })
      }

      state.forEach(async e => {
        await City.find({
          stateId: e._id
        }, (error, city) => {
          if (error) {
            return res.status(500).json({
              error: `Something bad occurred: ${error}`
            })
          }

          city.forEach(async e => {
            await City.deleteOne({
              _id: e._id
            })
          })
        })

        await State.deleteOne({
          _id: e._id
        })
      })
    })

    result = await Country.deleteOne({
      _id: countryInfo._id
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