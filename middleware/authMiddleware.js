const jwt = require("jsonwebtoken")

/**
 * User jwt middleware
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
exports.jwtUserMiddleware = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    token = token?.replace(/^Bearer\s+/, "");

    jwt.verify(token, process.env.JWTUSERSECRETTOKEN, async (err, jwtData) => {
        if (err) {
            return res.status(401).json({
                message: "Failed to verify token",
                error: err,
            })
        }

        if (process.env.JWTUSERROLE !== jwtData.role) {
            return res.status(403).json({
                message: "role unverified"
            })
        }

        res.locals.jwtData = jwtData

        next()
    })
}

/**
 * Admin jwt middleware
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
exports.jwtAdminMiddleware = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    token = token?.replace(/^Bearer\s+/, "");

    jwt.verify(token, process.env.JWTADMINSECRETTOKEN, (err, jwtData) => {
        if (err) {
            return res.status(401).json({
                message: "Failed to verify token",
                error: err
            })
        }

        if (process.env.JWTADMINROLE !== jwtData.role) {
            return res.status(403).json({
                message: "role unverified"
            })
        }

        res.locals.jwtData = jwtData

        next()
    })
}
