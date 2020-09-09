const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const app = {}

const {
  randomNumber,
  validation
} = require('../helpers')

const {
  Token,
  User
} = require('../models')

app.register = async (req, res, next) => {
  /* Validate data */
  const {
    error
  } = validation.registerValidation(req.body)
  if (error) return res.status(400).json(error.details[0].message)

  /* Checking if the user is already in the database */
  const emailExist = await User.findOne({
    email: req.body.email
  })
  if (emailExist) {
    return res.status(400).json({
      error: 'Email already exist!'
    })
  }

  async function createUID () {
    const uidRandom = await randomNumber()
    const userInfo = await User.findOne({
      uid: uidRandom
    })
    if (userInfo) {
      createUID()
    } else {
      /* Hash password */
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)

      const newData = new User({
        displayName: req.body.displayName || '',
        email: req.body.email,
        password: hashedPassword,
        phoneNumber: req.body.phoneNumber || '',
        photoURL: req.body.photoURL || '',
        uid: uidRandom
      })

      let result
      try {
        result = await newData.save()

        res.status(201).json({
          displayName: result.displayName,
          email: result.email,
          phoneNumber: result.phoneNumber,
          photoURL: result.photoURL,
          providerId: 'MyAuth',
          uid: result.uid
        })
      } catch (error) {
        res.status(500).json({
          error: error.toString()
        })
      }
    }
  }
  createUID()
}

app.login = async (req, res, next) => {
  /* Validate data */
  const {
    error
  } = validation.loginValidation(req.body)
  if (error) {
    return res.status(400).json({
      error: error.toString()
    })
  }

  /* Checking if the user is already in the database */
  const user = await User.findOne({
    email: req.body.email
  })
  if (!user) {
    return res.status(400).json({
      error: 'Email or password in wrong!'
    })
  }

  /* Password in correct */
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) {
    res.status(400).json({
      error: 'Email or password in wrong!'
    })
  }

  async function createUID () {
    const uidRandom = await randomNumber()
    const tokenInfo = await Token.findOne({
      jwtid: uidRandom
    })
    if (tokenInfo) {
      createUID()
    } else {
      const newData = new Token({
        jwtid: uidRandom
      })

      let token
      try {
        await newData.save()

        token = JWT.sign({
          _id: user._id
        }, process.env.SECRET_KEY, {
          expiresIn: '1h',
          jwtid: uidRandom
        })

        res.status(200).header('Authorization', token).json({
          data: {
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerId: user.providerId,
            uid: user.uid
          },
          jwt: token
        })
      } catch (error) {
        res.status(500).json({
          error: error.toString()
        })
      }
    }
  }
  createUID()
}

module.exports = app
