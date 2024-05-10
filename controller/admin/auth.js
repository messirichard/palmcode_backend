const {sign} = require("jsonwebtoken");
const {comparePassword, generateToken} = require("../../util/util");
const models = require("../../models");
exports.loginAdmin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required"
            })
        }

        const admin = await models.Admin.findOne({ where: { email }})

        if (!admin) {
            return res.status(404).json({
                message: "admin not found"
            })
        }

        const data = await comparePassword(password, admin.password)

        if (!data) {
            return res.status(400).json({
                message: "password is incorrect"
            })
        }

        const token = await generateToken(admin.id, process.env.JWTADMINROLE, process.env.JWTADMINSECRETTOKEN);

        return res.json({
            message: "Login Success",
            token
        })
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
