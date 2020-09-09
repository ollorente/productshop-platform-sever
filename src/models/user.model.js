const {
  Schema,
  model
} = require('mongoose')

const dbSchema = new Schema({
  displayName: {
    type: String,
    max: 256,
    min: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 256,
    min: 6
  },
  password: {
    type: String,
    required: true,
    max: 255,
    min: 3
  },
  phoneNumber: {
    type: String,
    max: 20,
    min: 6
  },
  photoURL: String,
  providerId: String,
  uid: {
    type: String,
    unique: true,
    required: true
  },
  _products: [{
    type: Schema.ObjectId,
    ref: 'Product'
  }],
  _productsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isLock: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = model('User', dbSchema)
