const {
  pagination
} = require('../helpers')

const app = {}

const {
  Superuser
} = require('../models')

app.create = async (req, res, next) => {
  let result
  try {
    result = await 'Create'

    res.status(200).json({
      data: result
    })
  } catch (error) {
    res.status(500).json({
      error: error.toString()
    })
  }
}

app.list = async (req, res, next) => {
  let result
  try {
    result = await 'List'

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
