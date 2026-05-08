
const Url = require("../models/url_model");
const Analytics = require("../models/analytics_model");
const { success } = require("zod");

const getAnalyticsByShortCode = async (req , res) => {
    try{
        const { shortCode } = req.params;

        // find the matching file
        const url = await Url.findOne({ shortCode });

        if(!url){
            return res.status(404).json({
                success : false,
                message : "Short Url Not found",
            });
        }
        // find Analytics records
        const analytics = await Analytics.find({
            urlId : url._id,
        });

        return res.status(200).json({
            success : true,
            totalClicks : url.clicks,
            analytics,
        });

    }
    catch(error){
        console.log("Analytics error found " , error.message);
        return res.status(500).json({
            success : false,
            message : "Internal Server error",
        })
    }
}


module.exports = { getAnalyticsByShortCode };
