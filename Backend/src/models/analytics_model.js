const mongoose = require("mongoose");
const analyticsSchema = new Mongoose.Schema(
    {
        shortUrlId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ShortUrl",
            required : true,
        },

        ipAddress : {
            type : String,
        },

        userAgent : {
            type : String,
        },

        referrer : {
            type : String,
        },

        clickedAt : {
            type : Date,
            default : Date.now,
        },
    },
    {
        timestamps : true,
    }
);


module.exports = mongoose.model("Analytics" , analyticsSchema);

