const mongoose = require("mongoose");
const { Schema } = mongoose;

const CountercontractorSchema = new Schema({
    id: {
        type: String,
    },
    seq: {
        type: Number,
    }
});

module.exports = mongoose.model('Countercontractor', CountercontractorSchema);