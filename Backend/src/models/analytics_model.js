const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    shortUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true,
      index: true
    },

    ipAddress: String,

    userAgent: String,

    referrer: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Analytics",
  analyticsSchema
);