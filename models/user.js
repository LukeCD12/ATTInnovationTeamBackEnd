const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Store'
        }
    ]
})

module.exports = mongoose.model('User', userSchema)