require("dotenv").config();
const mongoose = require("mongoose");

const connectToMongo = async () => {
  const DB = process.env.DATABASE;
  mongoose
    .connect(DB)
    .then(() => {
      console.log("mongodb connected");
    })
    .catch((err) => console.log("error"));
};

module.exports = connectToMongo;
