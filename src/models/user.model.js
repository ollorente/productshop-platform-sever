const {
  Schema,
  model
} = require('mongoose')

const dbSchema = new Schema({
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: String,
  photoURL: String,
  providerId: String,
  uid: {
    type: String,
    required: true,
    unique: true
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
