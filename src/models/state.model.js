const {
  Schema,
  model
} = require('mongoose')

const dbSchema = new Schema({
  countryId: {
    type: Schema.ObjectId,
    ref: 'Country'
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
  },
  _cities: [{
    type: Schema.ObjectId,
    ref: 'City'
  }],
  _citiesCount: {
    type: Number,
    default: 0
  }
})

module.exports = model('State', dbSchema)
