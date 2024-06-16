const mongoose = require("mongoose");
const { Schema } = mongoose;

const CounterdailyWorkerSchema = new Schema({
    id: {
        type: String,
    },
    seq: {
        type: Number,
    }
});

module.exports = mongoose.model('CounterdailyWorker', CounterdailyWorkerSchema);