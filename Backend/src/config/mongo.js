const mongoose = require("mongoose");

async function connectMongo(uri) {
  try {
    await mongoose.connect(uri);
    console.log("Mongo connected");
  } catch (err) {
    console.error("Mongo connection failed:", err.message);
    throw err;
  }
}

module.exports = { connectMongo };