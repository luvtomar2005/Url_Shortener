
const Analytics = require("../models/analytics_model");
const Url = require("../models/url_model");

const trackAnalytics = async ({
    urlId,
    ipAddress,
    userAgent,
    referrer,
}) => {
    try{
        // create analytics event
        await Analytics.create({
            urlId,
            ipAddress,
            userAgent,
            referrer,
        });

        // Increment total clicks
        await Url.findByIdAndUpdate(urlId, {
            $inc : {clicks : 1},
        });


        return true;
        
    }
    catch(err){
        console.log("Analytics tracking falied" , err.message);

        return false;
    }
}

module.exports = {
    trackAnalytics,
};
