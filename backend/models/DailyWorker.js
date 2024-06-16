const mongoose = require("mongoose");
const { Schema } = mongoose;

const DailyWorkerSchema = new Schema({
  slNo: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: "NA",
  },
  guardian: {
    type: String,
    default: "NA",
  },
  guardianName: {
    type: String,
    default: "NA",
  },
  address: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  natureOfWork: {
    type: String,
    required: true,
  },
  duration: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  validupto: {
    type: String,
    required: true,
  },
  tin: {
    type: String,
    required: true,
  },
  tout: {
    type: String,
    default: "-1",
  },
  inTimeAddedBy: {
    type: Number,
    required: true,
  },
  ouTimeAddedBy: {
    type: Number,
    default: "-1",
  },
  pastvisit: [
    {
      pasttin: String,
      pasttout: String,
      pastinTimeAddedBy: String,
      pastouTimeAddedBy: String,
    },
  ],
});

module.exports = mongoose.model("DailyWorker", DailyWorkerSchema);
