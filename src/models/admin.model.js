const {
    Schema,
    model
} = require('mongoose')

const dbSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    isLock: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = model('Admin', dbSchema)