const { randomUUID } = require("crypto");

const requestId = (req , res , next) => {
    const incomingRequestId = req.headers["x-request-id"];

    const requestId = incomingRequestId || randomUUID();

    req.requestId = requestId;

    res.setHeader("x-headers-id" , requestId);

    next();
}
module.exports = requestId;