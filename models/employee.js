const mongoose = require('mongoose')

const Schema = mongoose.Schema

const employeeSchema = new Schema({
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
    manager: {
        type: Boolean,
        required: true
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store'
    }
})

module.exports = mongoose.model('Employee', employeeSchema)