const {sign} = require("jsonwebtoken");
const {comparePassword} = require("../../util/util");
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

        const token = sign({ id: admin.id, role: process.env.JWTADMINROLE }, process.env.JWTADMINSECRETTOKEN, {
            expiresIn: 86400, // 24 hours
        });

        console.log(token)

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
