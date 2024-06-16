const mongoose = require("mongoose");
const { Schema } = mongoose;

const Contractor = new Schema({
    slNo: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    driverName: {
        type: String,
        required: true,
    },
    dlNo: {
        type: String,
        default: 'NA',
    },
    cn: {
        type: String,
        default: 'NA',
    },
    amount: {
        type: String,
        required: true,
    },
    product: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    vn: {
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
        pastcn: String,
        pastamount: String,
        pastproduct: String,
        pastfrom: String,
        pastinTimeAddedBy: String,
        pastouTimeAddedBy: String,
    }],
});

module.exports = mongoose.model('Contractor', Contractor);