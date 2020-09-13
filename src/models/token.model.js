const {
  Schema,
  model
} = require('mongoose')

const dbSchema = new Schema({
  jwtid: {
    type: String,
    unique: true,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
})

module.exports = model('Token', dbSchema)
