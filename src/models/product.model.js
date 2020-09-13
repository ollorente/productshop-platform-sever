const {
  Schema,
  model
} = require('mongoose')

const dbSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  barcode: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  description: String,
  legals: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isLock: {
    type: Boolean,
    default: false
  },
  _photos: [{
    type: Schema.ObjectId,
    ref: 'Photo'
  }],
  _photosCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
})

module.exports = model('Product', dbSchema)
