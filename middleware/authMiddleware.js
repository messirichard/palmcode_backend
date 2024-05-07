const jwt = require("jsonwebtoken")

/**
 * User jwt middleware
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
exports.jwtUserMiddleware = async (req, res, next) => {
    const {
        token
    } = req.headers

    jwt.verify(token, process.env.JWTUSERSECRETTOKEN, async (err, jwtData) => {
        if (err) {
            return res.status(401).json({
                message: "Failed to verify token",
                error: err,
            })
        }

        if (process.env.JWTUSERSECRETTOKEN !== jwtData.role) {
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
    const {
        token
    } = req.headers

    if (!token) {
        return res.status(400).json({
            message: "Token in headers is required"
        })
    }

    jwt.verify(token, process.env.JWTADMINSECRETTOKEN, (err, jwtData) => {
        if (err) {
            return res.status(401).json({
                message: "Failed to verify token",
                error: err
            })
        }

        if (process.env.JWTADMINIDENTIFIER !== jwtData.role) {
            return res.status(403).json({
                message: "role unverified"
            })
        }

        res.locals.jwtData = jwtData

        next()
    })
}
