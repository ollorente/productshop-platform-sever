const {
  Schema,
  model
} = require('mongoose')

const dbSchema = new Schema({
  productId: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  image: {
    type: String,
    required: true
  },
  publicId: String,
  order: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  versionKey: false
})

module.exports = model('Photo', dbSchema)
