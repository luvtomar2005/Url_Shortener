
const { resolveRedirectService } = require("../service/redirect_service");

const { trackAnalytics }  = require("../service/analytics_service");

const redirectToOriginalUrl = async (req , res, next) => {
    try{

        const { shortCode } = req.params;

        // basic shortCode validation
        if(!shortCode || !/^[a-zA-Z0-9_-]+$/.test(shortCode)){
            return res.status(400).json({
                success : false,
                message : "Invalid short code"
            });
        }
        // resolve redirect using service layer
        const url = await resolveRedirectService(shortCode);
        // not found / expired/ inactive
        if(!url){
            return res.status(404).json({
                success : false,
                message : "Short Url not found",
            });
        }
        
        // analytics tracking
        const ipAddress = req.ip;

        const userAgent = req.get("User-Agent");

        const referrer = req.get("Referrer") || req.get("Referrer");

        await trackAnalytics({

            urlId : url._id,
            ipAddress,
            userAgent,
            referrer,

        });

        return res.redirect(url.originalUrl);
        
    }
    catch(err){
        return next(err);
    }
}



module.exports = { redirectToOriginalUrl }