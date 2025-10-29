const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://harshagrwl09:yZvxaR5Nes61s3Q1@harsh09.hx3jhmq.mongodb.net/"
  );
};

module.exports = connectDB;
