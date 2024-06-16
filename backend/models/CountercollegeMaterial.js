const mongoose = require("mongoose");
const { Schema } = mongoose;

const CountercollegeMaterialSchema = new Schema({
    id: {
        type: String,
    },
    seq: {
        type: Number,
    }
});

module.exports = mongoose.model('CountercollegeMaterial', CountercollegeMaterialSchema);