const {
  Schema,
  model
} = require('mongoose')

const dbSchema = new Schema({
  stateId: {
    type: Schema.ObjectId,
    ref: 'State'
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

module.exports = model('City', dbSchema)
