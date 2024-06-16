const mongoose = require("mongoose");
const { Schema } = mongoose;

const VisitorSchema = new Schema({
    slNo: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: 'NA',
    },
    address: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    vn: {
        type: String,
        required: true,
    },
    vt: {
        type: String,
        required: true,
    },
    tin: {
        type: String,
        required: true,
    },
    tout: {
        type: String,
        default: '-1',
    },
    inTimeAddedBy: {
        type: Number,
        required: true,
    },
    ouTimeAddedBy: {
        type: Number,
        default: '-1',
    },
    pastvisit: [{
        pasttin: String,
        pasttout: String,
        pastvn: String,
        pastvt: String,
        pastpurpose: String,
        pastinTimeAddedBy: String,
        pastouTimeAddedBy: String,
    }],
});

module.exports = mongoose.model('Visitor', VisitorSchema);