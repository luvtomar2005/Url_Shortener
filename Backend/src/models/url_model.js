// const mongoose = require("mongoose");
const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
    {
        shortCode : {
            type : String,
            required : true,
            unique : true
        },

        originalUrl : {
            type : String,
            required : true
        },

        expiresAt : {
            type : Date,
            default : null
        }


    },
    {
        timestamps : true
    }
)


module.exports = mongoose.model("Url" , UrlSchema);