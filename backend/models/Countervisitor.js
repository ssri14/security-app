const mongoose = require("mongoose");
const { Schema } = mongoose;

const CountervisitorSchema = new Schema({
    id: {
        type: String,
    },
    seq: {
        type: Number,
    }
});

module.exports = mongoose.model('Countervisitor', CountervisitorSchema);