// const mongoose = require("mongoose");
const mongoose = require("mongoose");

const UrlSchema = new Mongoose.UrlSchema(
    {
        shortCode : {
            type : String,
            required : true,
            unique : true
        },

        destinationUrl : {
            type : String,
            required : true
        },

        expiresAt : {
            type : Date,
            default : null
        }


    },
    {
        timeStamps : true
    }
)

module.exports = mongoose.model("Url" , Schema);
