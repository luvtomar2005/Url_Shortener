const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Url",

      required: true,

      index: true,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    referrer: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Analytics", analyticsSchema);
