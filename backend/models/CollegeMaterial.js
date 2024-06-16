const mongoose = require("mongoose");
const { Schema } = mongoose;

const CollegeMaterial = new Schema({
    slNo: {
        type: Number,
    },
    particularOfPerson: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    materials: [{
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: String,
            required: true,
        }
    }],
    incomingOrOutgoing: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    tout: {
        type: String,
        required: true,
    },
    ouTimeAddedBy: {
        type: Number,
        required: true,
    },
    remarks: {
        type: String,
        default: 'N/R',
    }
});

module.exports = mongoose.model('CollegeMaterial', CollegeMaterial);