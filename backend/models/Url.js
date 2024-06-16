const mongoose = require("mongoose");
const { Schema } = mongoose;

const UrlSchema = new Schema({
    id: {
        type: Number,
        default: 1,
    },
    urlText: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Url', UrlSchema);