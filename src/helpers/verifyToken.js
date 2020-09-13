const jwt = require('jsonwebtoken')

module.exports = function auth (req, res, next) {
  const token = req.header('Authorization')
  if (!token) {
    return res.status(401).json({
      error: 'Access denied'
    })
  }

  try {
    const bearer = token.split(' ')[1]

    const verified = jwt.verify(bearer, process.env.SECRET_KEY)
    req.user = verified

    next()
  } catch (error) {
    res.status(400).json({
      error: error.toString()
    })
  }
}
