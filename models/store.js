const mongoose = require('mongoose');
const { FieldsOnCorrectTypeRule } = require('graphql');

const Schema = mongoose.Schema;
const storeSchema = new Schema({
    capacity: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    maskCount: {
        type: Number,
        required: true
    },
    numCustomers: {
        type: Number,
        required: true
    },
    employeeList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Employee'
        }
    ]
});

module.exports = mongoose.model('Store', storeSchema)