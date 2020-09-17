const {
  Schema,
  model
} = require('mongoose')

const dbSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  code: String,
  currency: {
    type: String,
    uppercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  _states: [{
    type: Schema.ObjectId,
    ref: 'State'
  }],
  _statesCount: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false
})

module.exports = model('Country', dbSchema)
