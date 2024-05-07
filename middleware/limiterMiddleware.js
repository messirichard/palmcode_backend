const rateLimit = require("express-rate-limit");

/**
 *
 * @type {RateLimitRequestHandler}
 */
exports.limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 24 hrs in milliseconds
    max: 10,
    message: 'You have exceeded the 10 requests in 15 minute limit!',
    standardHeaders: true,
    legacyHeaders: false,
});
