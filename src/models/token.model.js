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
    timestamps: true
})

module.exports = model('Token', dbSchema)