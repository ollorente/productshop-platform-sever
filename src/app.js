require('dotenv').config()
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer')

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpg|jpeg|png|gif$i/)) {
      cb(new Error('<<< File not supported!. >>>'), false)
    }
    cb(null, true)
  },
  dest: path.join(__dirname, '/public/temp'),
  limits: {
    fileSize: 1024 * 1024 * 2
  }
}).single('image'))

app.use('/api/v1', require('./routes'))

app.use(express.static(path.join(__dirname, 'public')))

module.exports = app
