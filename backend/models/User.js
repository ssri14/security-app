const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    id: { //slNo
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    designation: {
        type: String,
        enum: ['guard', 'admin'],
        default: 'guard',
    },
});

module.exports = mongoose.model('User', UserSchema);